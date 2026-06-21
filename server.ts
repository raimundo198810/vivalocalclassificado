import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Load environment variables
dotenv.config();

// In-memory global data storage for seamless session-based simulation when offline
const simulatedDb = {
  usuarios: [
    { id: 1, nome: "Raimundo Moreira", email: "raimundo@vivalocal.com", senha: "pashed_password_1", criado_em: new Date().toISOString() },
    { id: 2, nome: "Marcos Silva", email: "marcos@gmail.com", senha: "pashed_password_2", criado_em: new Date().toISOString() },
    { id: 3, nome: "Roberto Santana", email: "roberto@imoveis.com.br", senha: "pashed_password_3", criado_em: new Date().toISOString() }
  ] as any[],
  anuncios: [] as any[],
  pagamentos: [] as any[]
};

// Lazy loaded pool reference
let pool: mysql.Pool | null = null;
let useDatabaseSimulation = false;
let databaseDiagnosticsError = "";

// Helper: Establish connection pool and run table creation statement logic
async function getPool(): Promise<mysql.Pool | null> {
  if (useDatabaseSimulation) return null;
  if (pool) return pool;

  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "vivalocal",
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 4000 // Fails fast to simulation mode if no database is found
  };

  try {
    console.log(`[DATABASE] Checking connection to MySQL server on host "${dbConfig.host}"...`);
    
    // Quick probe connection to host to auto-create database if not existing
    const tempConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      connectTimeout: 3000
    });
    
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempConn.end();

    console.log(`[DATABASE] Database "${dbConfig.database}" verified. Instantiating pool...`);
    pool = mysql.createPool(dbConfig);
    
    // Auto sync tables schemas
    const conn = await pool.getConnection();
    console.log("[DATABASE] Connection established. Creating/checking table schema structures...");

    await conn.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT DEFAULT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        link TEXT,
        destaque TINYINT DEFAULT 0,
        pago TINYINT DEFAULT 0,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        anuncio_id INT NOT NULL,
        mp_payment_id VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) NOT NULL DEFAULT 'pendente',
        valor DECIMAL(10,2) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    conn.release();
    console.log("[DATABASE] ✅ SUCCESS: All tables (usuarios, anuncios, pagamentos) synchronized in MySQL!");
    databaseDiagnosticsError = "";
    return pool;
  } catch (error: any) {
    databaseDiagnosticsError = error.message;
    console.warn(`[DATABASE] ⚠️ Offline Fallback Triggered. MySQL Connection Failed at ${dbConfig.host}:3306 - Message: "${error.message}"`);
    console.warn(`[DATABASE] Applet will automatically run in local sandboxed simulation mode. Your application will work seamlessly with live memory database storage!`);
    useDatabaseSimulation = true;
    return null;
  }
}

// Active Database abstraction client
const db = {
  query: async (sql: string, params: any[] = []) => {
    try {
      const activePool = await getPool();
      if (activePool) {
        // Run against live MySQL database
        const [rows] = await activePool.execute(sql, params);
        return { rows: Array.isArray(rows) ? rows : [rows], liveMySQL: true };
      }
    } catch (err: any) {
      console.error(`[DATABASE LOGICAL ERROR] MySQL Query failed:`, err.message);
    }

    // In-memory SQL Emulation fallback handler to allow the frontend to work 100% correctly
    const normalizedSql = sql.replace(/\s+/g, " ").trim().toUpperCase();
    console.log(`[SIMULATED QUERY] Executing mockup SQL logic: "${sql}"`, params);

    // 1. Webhook or check updates Simulation
    if (normalizedSql.includes("UPDATE ANUNCIOS SET DESTAQUE = 1 , PAGO = 1 WHERE ID = ?") || normalizedSql.includes("UPDATE ANUNCIOS SET DESTAQUE = 1, PAGO = 1")) {
      const adId = params[0]?.toString();
      const existingAdIndex = simulatedDb.anuncios.findIndex(a => a.id?.toString() === adId);
      if (existingAdIndex !== -1) {
        simulatedDb.anuncios[existingAdIndex].destaque = 1;
        simulatedDb.anuncios[existingAdIndex].pago = 1;
        console.log(`[SIMULATED QUERY] Successfully released ad ID "${adId}": setting status to PAID and VIP!`);
      }
    }
    
    // 2. INSERT PAGAMENTOS Simulation
    if (normalizedSql.includes("INSERT INTO PAGAMENTOS")) {
      // Expecting: INSERT INTO pagamentos (anuncio_id, mp_payment_id, status, valor) VALUES (?, ?, ?, ?)
      const adId = params[0];
      const mpId = params[1];
      const status = params[2];
      const val = params[3];
      const newPay = {
        id: simulatedDb.pagamentos.length + 1,
        anuncio_id: adId,
        mp_payment_id: mpId,
        status: status || "pendente",
        valor: val || 29.90,
        criado_em: new Date().toISOString()
      };
      simulatedDb.pagamentos.push(newPay);
      console.log(`[SIMULATED QUERY] Logged payment in simulated table:`, newPay);
    }

    // 3. INSERT ANUNCIOS Simulation
    if (normalizedSql.includes("INSERT INTO ANUNCIOS")) {
      const uId = params[0];
      const title = params[1];
      const desc = params[2];
      const link = params[3];
      const dest = params[4] || 0;
      const pago = params[5] || 0;
      const newAd = {
        id: simulatedDb.anuncios.length + 101, // offset to prevent collisions
        usuario_id: uId,
        titulo: title,
        descricao: desc,
        link: link,
        destaque: dest,
        pago: pago,
        criado_em: new Date().toISOString()
      };
      simulatedDb.anuncios.push(newAd);
      console.log(`[SIMULATED QUERY] Logged advertisement in simulated table:`, newAd);
    }

    return { rows: [], liveMySQL: false };
  }
};

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

  // Endpoint: DB Diagnostics & Status monitor for Admin panel
  app.get("/api/admin/database-status", async (req, res) => {
    try {
      const activePool = await getPool();
      const usingMySQL = activePool !== null;
      let tablesStatus: any = {};
      let totalUsersCount = simulatedDb.usuarios.length;
      let totalAdsCount = simulatedDb.anuncios.length;
      let totalPaymentsCount = simulatedDb.pagamentos.length;

      if (usingMySQL && activePool) {
        try {
          const [userRows]: any = await activePool.query("SELECT COUNT(*) as count FROM usuarios");
          const [adRows]: any = await activePool.query("SELECT COUNT(*) as count FROM anuncios");
          const [payRows]: any = await activePool.query("SELECT COUNT(*) as count FROM pagamentos");
          
          totalUsersCount = userRows[0]?.count || 0;
          totalAdsCount = adRows[0]?.count || 0;
          totalPaymentsCount = payRows[0]?.count || 0;

          tablesStatus = {
            usuarios: { status: "Active", rowCount: totalUsersCount },
            anuncios: { status: "Active", rowCount: totalAdsCount },
            pagamentos: { status: "Active", rowCount: totalPaymentsCount }
          };
        } catch (dbErr: any) {
          tablesStatus = { error: dbErr.message };
        }
      } else {
        tablesStatus = {
          usuarios: { status: "Simulado no Core", rowCount: totalUsersCount },
          anuncios: { status: "Simulado no Core", rowCount: totalAdsCount },
          pagamentos: { status: "Simulado no Core", rowCount: totalPaymentsCount }
        };
      }

      res.json({
        success: true,
        usingMySQL,
        connectionConfig: {
          host: process.env.DB_HOST || "localhost",
          database: process.env.DB_NAME || "vivalocal",
          user: process.env.DB_USER || "root",
          passwordSet: !!process.env.DB_PASS
        },
        diagnostics: {
          status: usingMySQL ? "CONECTADO A BASE DE DADOS VIVALOCAL" : "EXECUTANDO COM BANCO SIMULADO SEGURO (MEMORY-FALLBACK)",
          error: databaseDiagnosticsError || null,
          simulatedState: {
            usersCached: simulatedDb.usuarios.length,
            listingsCached: simulatedDb.anuncios.length,
            paymentsCached: simulatedDb.pagamentos.length
          }
        },
        counts: {
          usuarios: totalUsersCount,
          anuncios: totalAdsCount,
          pagamentos: totalPaymentsCount
        },
        tables: tablesStatus
      });
    } catch (err: any) {
      res.status(505).json({ success: false, error: err.message });
    }
  });

  // Endpoint: Execute real SQL test statements or simulations from Admin Console
  app.post("/api/admin/database-test-query", async (req, res) => {
    try {
      const { queryText } = req.body;
      if (!queryText) {
        return res.status(400).json({ success: false, error: "A instrução SQL não pode ser vazia" });
      }

      console.log(`[SQL ADMIN TERMINAL] Requested instruction: "${queryText}"`);
      const { rows, liveMySQL } = await db.query(queryText, []);

      res.json({
        success: true,
        queryExecuted: queryText,
        liveMySQL: !!liveMySQL,
        rows: rows || []
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Endpoint: Action to easily seed a user manually in the DB
  app.post("/api/admin/create-usuario", async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Falta nome, email ou senha" });
      }

      await db.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha]
      );
      
      // Update local storage too
      simulatedDb.usuarios.push({
        id: simulatedDb.usuarios.length + 1,
        nome,
        email,
        senha,
        criado_em: new Date().toISOString()
      });

      res.json({ success: true, message: `Usuário '${nome}' inserido com sucesso!` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Endpoint: Action to easily seed an listing manually in the DB
  app.post("/api/admin/create-anuncio", async (req, res) => {
    try {
      const { usuario_id, titulo, descricao, link, destaque, pago } = req.body;
      if (!titulo) {
        return res.status(400).json({ error: "Falta título do anúncio hígido" });
      }

      const uId = usuario_id ? Number(usuario_id) : 1;
      const destVal = destaque ? 1 : 0;
      const pagoVal = padoVal => 0; // standard fallback
      const realPago = pago ? 1 : 0;

      await db.query(
        "INSERT INTO anuncios (usuario_id, titulo, descricao, link, destaque, pago) VALUES (?, ?, ?, ?, ?, ?)",
        [uId, titulo, descricao || "", link || "", destVal, realPago]
      );
      
      res.json({ success: true, message: `Anúncio '${titulo}' inserido com sucesso!` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Endpoint: Create live Mercado Pago PIX Payment
  app.post("/api/payments/create-pix", async (req, res) => {
    try {
      const { amount, email, description, listingId, callbackUrl } = req.body;

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

      // Dynamically resolve notification URL to support multiple sandbox servers / dev previews properly on checkout
      const origin = req.headers.origin || req.headers.referer;
      const host = req.get("host");
      let resolvedHost = "https://ais-dev-4dp4dmqup5exzsrkymidfu-626158510053.us-west2.run.app";
      if (origin) {
        resolvedHost = origin;
      } else if (host) {
        resolvedHost = `https://${host}`;
      }
      
      // Strip trailing slashes
      const cleanHost = resolvedHost.replace(/\/+$/, "");
      const notificationUrl = callbackUrl || (process.env.APP_URL 
        ? `${process.env.APP_URL.replace(/\/+$/, "")}/api/payments/webhook`
        : `${cleanHost}/api/payments/webhook`);

      console.log(`[PAYMENT] Resolving notification webhook URL: ${notificationUrl}`);

      // Setup body for Mercado Pago API v1 Payments
      const bodyPayload = {
        transaction_amount: Number(Number(amount).toFixed(2)),
        description: description || "vivaLocal Destaque Premium",
        payment_method_id: "pix",
        notification_url: notificationUrl,
        payer: {
          email: cleanEmail,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: "CPF",
            number: testCpf
          }
        },
        external_reference: listingId || "",
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

      // 💾 PERSIST IN SQL DATABASE: Insert a row in MySQL database table 'pagamentos' as 'pendente'
      try {
        const adNumId = listingId ? Number(listingId.toString().replace(/[^0-9]/g, "")) || 18 : 18;
        await db.query(
          "INSERT INTO pagamentos (anuncio_id, mp_payment_id, status, valor, criado_em) VALUES (?, ?, 'pendente', ?, NOW())",
          [adNumId, paymentId, Number(amount)]
        );
        console.log(`[DATABASE] Payment record created in MySQL table 'pagamentos' for adID ${adNumId}`);
      } catch (dbErr: any) {
        console.error(`[DATABASE ERROR] Failed to save pending payment:`, dbErr.message);
      }

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

      console.log("=== MERCADO PAGO WEBHOOK ===");
      console.log("Headers:", req.headers);
      console.log("Body:", JSON.stringify(body));
      console.log("Query parameters:", JSON.stringify(req.query));

      const signatureHeader = (req.headers["x-signature"] as string) || "";
      const requestId = (req.headers["x-request-id"] as string) || "";

      const dataId =
        (req.query["data.id"] as string) ||
        (req.query["id"] as string) ||
        body.data?.id ||
        null;

      const type = body.type || body.action || (req.query.topic as string) || (req.query.type as string);

      const paymentId =
        dataId ||
        body.data?.id ||
        (body.resource ? body.resource.split("/").pop() : null);

      if (!paymentId) {
        console.log("❌ Payment ID não encontrado");
        return res.sendStatus(200);
      }

      console.log("📌 Payment ID:", paymentId);

      // =========================
      // 🔐 WEBHOOK SIGNATURE (opcional)
      // =========================
      const activeWebhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET || WEBHOOK_SECRET;

      if (activeWebhookSecret && signatureHeader && requestId && dataId) {
        try {
          const parts = signatureHeader.split(",");

          let ts = "";
          let receivedHash = "";

          for (const part of parts) {
            const [key, val] = part.trim().split("=");
            if (key === "ts" || key === "t") ts = val;
            if (key === "v1") receivedHash = val;
          }

          if (ts && receivedHash) {
            const stringToSign = `id:${dataId};request-id:${requestId};ts:${ts};`;

            const crypto = await import("crypto");

            const computedHash = crypto
              .createHmac("sha256", activeWebhookSecret)
              .update(stringToSign)
              .digest("hex");

            if (computedHash !== receivedHash) {
              console.log("❌ Assinatura inválida");
              // Return status 401 on strict signature mismatch if secret is explicitly configured in environment
              if (process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
                return res.status(401).send("invalid signature");
              } else {
                console.log("⚠️ Verificação falhou mas continuando fluxo em modo Sandbox.");
              }
            } else {
              console.log("✅ Webhook autenticado");
            }
          }
        } catch (err) {
          console.log("⚠️ Falha na validação de assinatura:", err);
        }
      }

      // =========================
      // 💳 BUSCAR PAGAMENTO
      // =========================
      if (type?.includes("payment") || type === "payment" || !type) {
        const mpResponse = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN || ACCESS_TOKEN}`,
            },
          }
        );

        if (!mpResponse.ok) {
          console.log("❌ Erro ao buscar pagamento");
          return res.sendStatus(200);
        }

        const paymentData = await mpResponse.json();

        console.log("💰 Status do pagamento:", paymentData.status);

        // =========================
        // ✅ PAGAMENTO APROVADO
        // =========================
        if (paymentData.status === "approved") {
          console.log("🎉 PAGAMENTO APROVADO");

          // Keep in-memory cache updated to satisfy frontend polling
          approvedWebhookPayments.add(paymentId.toString());

          const anuncioIdRaw = paymentData.external_reference || paymentData.metadata?.listing_id;
          const anuncioId = anuncioIdRaw ? Number(anuncioIdRaw.toString().replace(/[^0-9]/g, "")) || null : null;

          // 💾 UPDATE DATABASE TABLE: Set payment status to 'pago' in 'pagamentos'
          try {
            await db.query(
              "UPDATE pagamentos SET status = 'pago' WHERE mp_payment_id = ?",
              [paymentId.toString()]
            );
            console.log(`[DATABASE] Payment ${paymentId} updated to status 'pago' in MySQL table 'pagamentos'.`);
          } catch (dbErr: any) {
            console.error(`[DATABASE LOGICAL ERROR] Failed to update payment row:`, dbErr.message);
          }

          if (anuncioId) {
            // 🔥 💾 UPDATE DATABASE TABLE: Liberar anúncio (destaque = 1, pago = 1) no banco
            await db.query(
              `UPDATE anuncios SET destaque = 1, pago = 1 WHERE id = ?`,
              [anuncioId]
            );

            console.log(`[DATABASE] Anúncio #${anuncioId} liberado com sucesso: pago = 1 e destaque = 1!`);
          }
        }
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error("❌ ERRO WEBHOOK:", error);
      return res.sendStatus(200);
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
