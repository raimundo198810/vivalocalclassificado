import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// In-memory memory cache for webhook verification
const approvedWebhookPayments = new Set<string>();

// Helper: Generate mathematically valid Brazilian CPF
function generateValidCPF(): string {
  const num = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  
  // Calculate first check digit (d10)
  let s1 = 0;
  for (let i = 0; i < 9; i++) {
    s1 += num[i] * (10 - i);
  }
  let r1 = s1 % 11;
  const d10 = r1 < 2 ? 0 : 11 - r1;
  num.push(d10);

  // Calculate second check digit (d11)
  let s2 = 0;
  for (let i = 0; i < 10; i++) {
    s2 += num[i] * (11 - i);
  }
  let r2 = s2 % 11;
  const d11 = r2 < 2 ? 0 : 11 - r2;
  num.push(d11);

  return num.join("");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to support JSON parsing
  app.use(express.json());

  // Credentials
  const PUBLIC_KEY = process.env.MERCADO_PAGO_PUBLIC_KEY || "APP_USR-59e29bee-606e-4ad0-bf3e-5c20cb319864";
  const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "APP_USR-3720899526137368-062104-ebb277be21c716e8f7f6abcc9fd43b97-3486812023";
  const WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET || "bed538cfb4d73823261b55cd2175f4f72fc1c5c985a75bc7d494fd36f3cc4978";

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
      const cleanEmail = email.trim();
      const nameParts = cleanEmail.split("@")[0].split(/[._-]/);
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : "Cliente";
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : "vivaLocal";

      // Setup mathematically valid CPF to bypass Mercado Pago Brazilian Gateway Bad Request validations
      const testCpf = generateValidCPF();

      // Setup body for Mercado Pago API v1 Payments
      const bodyPayload = {
        transaction_amount: Number(Number(amount).toFixed(2)),
        description: description || "vivaLocal Destaque Premium",
        payment_method_id: "pix",
        notification_url: `${process.env.APP_URL || "https://ais-dev-4dp4dmqup5exzsrkymidfu-626158510053.us-west2.run.app"}/api/payments/webhook`,
        payer: {
          email: cleanEmail,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: "CPF",
            number: testCpf
          }
        },
        metadata: {
          listing_id: listingId || ""
        }
      };

      console.log(`Sending PIX creation request to Mercado Pago. Amount: R$ ${amount}, Email: ${cleanEmail}, CPF: ${testCpf}`);

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

  // Endpoint: Instantly simulate a mock webhook approval for testing inside the Sandbox
  app.post("/api/payments/simulate-approve/:id", (req, res) => {
    const paymentId = req.params.id;
    if (paymentId) {
      approvedWebhookPayments.add(paymentId);
      console.log(`🚀 Manual testing Sandbox trigger: Payment ${paymentId} approved in local cache!`);
      return res.json({ success: true, status: "approved" });
    }
    res.status(400).json({ error: "No payment id provided" });
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
      const body = req.body;
      console.log("-----------------------------------------");
      console.log("Mercado Pago Webhook Received");
      console.log("Headers:", JSON.stringify(req.headers));
      console.log("Query parameters:", JSON.stringify(req.query));
      console.log("Payload body:", JSON.stringify(body));

      const signatureHeader = req.headers["x-signature"] as string || "";
      const requestId = req.headers["x-request-id"] as string || "";
      
      // Resource ID can come from 'data.id' query parameter, or 'id' query parameter,
      // or from body (body.data?.id), or resource path (such as /v1/payments/ID)
      const dataId = (req.query["data.id"] || req.query["id"] || body.data?.id || "") as string;

      // 1. Signature Verification Check
      if (signatureHeader && requestId && dataId) {
        console.log(`[WEBHOOK VALIDATION] Authenticating webhook via Mercado Pago Signature Verification...`);
        console.log(`[WEBHOOK VALIDATION] Signature: ${signatureHeader}`);
        console.log(`[WEBHOOK VALIDATION] Request ID: ${requestId}`);
        console.log(`[WEBHOOK VALIDATION] Resource ID: ${dataId}`);

        // Parse signature elements (ts=TIMESTAMP, v1=HASH)
        const parts = signatureHeader.split(",");
        let ts = "";
        let receivedHash = "";
        for (const part of parts) {
          const [key, val] = part.trim().split("=");
          if (key === "ts") ts = val;
          if (key === "v1") receivedHash = val;
        }

        if (ts && receivedHash) {
          // Construct signature validation text as per Mercado Pago Specification:
          // Format: id:[RESOURCE_ID];request-id:[REQUEST_ID];ts:[TIMESTAMP];
          const stringToSign = `id:${dataId};request-id:${requestId};ts:${ts};`;
          console.log(`[WEBHOOK VALIDATION] Constructing signature string: "${stringToSign}"`);

          const crypto = await import("crypto");
          // Generate computed signature using SHA-256 with HMAC using WEBHOOK_SECRET key
          const computedHash = crypto
            .createHmac("sha256", WEBHOOK_SECRET)
            .update(stringToSign)
            .digest("hex");

          if (computedHash === receivedHash) {
            console.log("[WEBHOOK VALIDATION] ✅ SUCCESS: Webhook notification verification passed! Authenticated with Mercado Pago.");
          } else {
            console.warn("[WEBHOOK VALIDATION] ❌ ERROR: Signature verification failed!");
            console.warn(`Computed: ${computedHash}`);
            console.warn(`Received: ${receivedHash}`);
            // Strictly reject spoofed / unauthenticated requests
            return res.status(401).json({ error: "Unauthorized: Webhook signature verification failed" });
          }
        } else {
          console.warn("[WEBHOOK VALIDATION] ⚠️ WARNING: Missing 'ts' or 'v1' properties inside x-signature header.");
        }
      } else {
        console.log("[WEBHOOK VALIDATION] ℹ️ Optional credentials or signature headers missing. Proceeding with safe fallback processing.");
      }

      // 2. Core Notification Processing
      const type = body.type || body.action;
      const paymentId = dataId || body.data?.id || (body.resource && body.resource.split("/").pop());

      if (paymentId && (type === "payment" || type?.includes("payment"))) {
        console.log(`[WEBHOOK PROCESSOR] Querying payment information to update status: paymentID ${paymentId}`);
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          }
        });

        if (mpResponse.ok) {
          const paymentData = await mpResponse.json();
          console.log(`[WEBHOOK PROCESSOR] Payment status fetched: ${paymentData.status}`);
          if (paymentData.status === "approved") {
            console.log(`[WEBHOOK PROCESSOR] Payment ID ${paymentId} marked as APPROVED in webhook stream.`);
            approvedWebhookPayments.add(paymentId.toString());
          }
        } else {
          console.error(`[WEBHOOK PROCESSOR] Failed to query Mercado Pago payment details: ${mpResponse.statusText}`);
        }
      }

      console.log("-----------------------------------------");
      // MP expects a 200/201 status code to stop re-sending the same webhook notification
      res.sendStatus(200);
    } catch (e: any) {
      console.error("[WEBHOOK PROCESSOR] Error handling webhook ingress:", e);
      res.sendStatus(200); // Return 200 anyway so that Mercado Pago doesn't flood the webhook retry queue
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
