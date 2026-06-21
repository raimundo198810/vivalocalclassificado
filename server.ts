import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// In-memory memory cache for webhook verification
const approvedWebhookPayments = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to support JSON parsing
  app.use(express.json());

  // Credentials
  const PUBLIC_KEY = process.env.MERCADO_PAGO_PUBLIC_KEY || "APP_USR-59e29bee-606e-4ad0-bf3e-5c20cb319864";
  const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "APP_USR-3720899526137368-062104-ebb277be21c716e8f7f6abcc9fd43b97-3486812023";

  // Enpoint: Get active Public Credentials safely
  app.get("/api/payments/config", (req, res) => {
    res.json({
      publicKey: PUBLIC_KEY,
      isLoaded: true
    });
  });

  // Root API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", provider: "Mercado Pago Real-Time API" });
  });

  // Endpoint: Create live Mercado Pago PIX Payment
  app.post("/api/payments/create-pix", async (req, res) => {
    try {
      const { amount, email, description, listingId } = req.body;

      if (!amount || !email) {
        return res.status(400).json({ error: "Missing required properties: amount and email are required" });
      }

      // Generate clean UUID/Idempotency Key
      const idempotencyKey = `mp-pix-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      // Setup body for Mercado Pago API
      const bodyPayload = {
        transaction_amount: Number(amount),
        description: description || "vivaLocal Destaque Premium",
        payment_method_id: "pix",
        notification_url: `${process.env.APP_URL || "https://ais-dev-4dp4dmqup5exzsrkymidfu-626158510053.us-west2.run.app"}/api/payments/webhook`,
        payer: {
          email: email.trim(),
          first_name: "Cliente",
          last_name: "vivaLocal"
        },
        metadata: {
          listing_id: listingId || ""
        }
      };

      console.log(`Sending PIX creation request to Mercado Pago. Amount: R$ ${amount}, Email: ${email}`);

      const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(bodyPayload)
      });

      if (!mpResponse.ok) {
        const errorText = await mpResponse.text();
        console.error("Mercado Pago API error details:", errorText);
        throw new Error(`Mercado Pago returned status ${mpResponse.status}: ${errorText}`);
      }

      const paymentData = await mpResponse.json();

      // Extract crucial PIX payload parameters
      const qrCode = paymentData.point_of_interaction?.transaction_data?.qr_code;
      const qrCodeBase64 = paymentData.point_of_interaction?.transaction_data?.qr_code_base64;
      const paymentId = paymentData.id?.toString();

      if (!qrCode) {
        throw new Error("Response did not contain qr_code payload.");
      }

      console.log(`Successfully generated dynamic PIX with Mercado Pago! ID: ${paymentId}`);

      res.json({
        success: true,
        paymentId: paymentId,
        qrCode: qrCode,
        qrCodeBase64: qrCodeBase64,
        amount: paymentData.transaction_amount,
        status: paymentData.status
      });

    } catch (e: any) {
      console.error("Failed to generate real Mercado Pago PIX:", e);
      res.status(500).json({ 
        success: false, 
        error: "Erro ao gerar PIX real. O servidor usará fallback seguro.", 
        details: e.message 
      });
    }
  });

  // Endpoint: Verify payment status (by polling or webhook state check)
  app.get("/api/payments/status/:id", async (req, res) => {
    try {
      const paymentId = req.params.id;

      // 1. Check if we already received webhook confirmation
      if (approvedWebhookPayments.has(paymentId)) {
        console.log(`Payment ${paymentId} checked. Found approved in webhook memory buffer!`);
        return res.json({ status: "approved", via: "webhook" });
      }

      // 2. Poll Mercado Pago API directly to see if status was updated
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      });

      if (!mpResponse.ok) {
        throw new Error(`Mercado Pago check returned status ${mpResponse.status}`);
      }

      const paymentData = await mpResponse.json();
      const status = paymentData.status; // 'pending', 'approved', 'rejected', etc.

      if (status === "approved") {
        approvedWebhookPayments.add(paymentId);
        console.log(`Payment ${paymentId} approved! Pulled directly from Mercado Pago live status query.`);
      }

      res.json({
        status: status,
        paymentId: paymentId,
        details: paymentData.status_detail || ""
      });

    } catch (e: any) {
      console.error(`Failed to verify payment status for ${req.params.id}:`, e);
      res.status(500).json({ error: "Erro ao checar status de pagamento no Mercado Pago", details: e.message });
    }
  });

  // Endpoint: Mercado Pago Webhook Ingress
  app.post("/api/payments/webhook", async (req, res) => {
    try {
      // Mercado Pago sends notifications on payment actions
      const body = req.body;
      console.log("Mercado Pago Webhook payload received:", JSON.stringify(body));

      // Notification may come with 'type': 'payment' and action 'payment.created' / 'payment.updated'
      const type = body.type || body.action;
      const paymentId = body.data?.id || (body.resource && body.resource.split("/").pop());

      if (paymentId && (type === "payment" || type?.includes("payment"))) {
        console.log(`Querying Mercado Pago webhook transaction: id ${paymentId}`);
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          }
        });

        if (mpResponse.ok) {
          const paymentData = await mpResponse.json();
          if (paymentData.status === "approved") {
            console.log(`Webhook approved successfully match! Payment ID: ${paymentId}`);
            approvedWebhookPayments.add(paymentId.toString());
          }
        }
      }

      // MP expects a 200/201 status code to stop re-sending the same webhook notification
      res.sendStatus(200);
    } catch (e) {
      console.error("Error handling webhook ingress:", e);
      res.sendStatus(200); // Return 200 anyway so that Mercado Pago doesn't flood the webhook
    }
  });

  // Vite dev or production server setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA path fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK VIVALOCAL] Server booted on port ${PORT}`);
    console.log(`[PAYMENT ENGINE] Mercado Pago online. Primary Webhook ready at /api/payments/webhook`);
  });
}

startServer();
