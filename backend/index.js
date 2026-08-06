const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 5000;
const path = require("path");
const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true,
}));
const bodyParser = require("body-parser");
const client = require("./connection.js");
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const followers = require("instagram-followers");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const { Pool } = require("pg");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const SECRET_KEY = "12345678901234567890123456789012";
const secretKey = "A232dsaddsdasXXZ";
const saltRounds = 10;

const createdTables = new Set();

// List of all tables
const tables = [
  "social_media_backupcodes",
  "system_logs",
  "username_history",
  "email_history",
  "accounts_history",
  "Accounting",
  "accounting_invoices",
  "accounting_logs",
  "job_descriptions",
  "quotation_v",
  "tasks",
  "maintenance",
  "recovered_accounts",
  "old_passwords",
  "expensives",
  "images",
  "images_employee",
  "sm_users",
  "employee",
  "social_media_accounts",
  "remaining_package_logs",
  "credit_cards",
  "admins",
  "expenses_logs",
  "salary",
  "user_type",
];

// ==========================================
// ENCRYPTION FUNCTIONS
// ==========================================
function encrypt(text) {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ==========================================
// SYSTEM LOGGING HELPER FUNCTIONS
// ==========================================

const getClientIP = (req) => {
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
};

const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

const getUsername = async (userId) => {
  if (!userId) return null;
  try {
    const result = await safeQuery('SELECT username FROM sm_users WHERE id = $1', [userId]);
    return result.rows[0]?.username || null;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
};

// Main logging function
const logSystemAction = async ({
  userId = null,
  username = null,
  actionType,
  entityType,
  entityId = null,
  actionDetails = {},
  oldData = null,
  newData = null,
  req = null,
  status = 'success',
  errorMessage = null,
}) => {
  try {
    let finalUsername = username;
    if (!finalUsername && userId) {
      finalUsername = await getUsername(userId);
    }

    const ipAddress = req ? getClientIP(req) : null;
    const userAgent = req ? getUserAgent(req) : null;

    const details = typeof actionDetails === 'string' ? JSON.parse(actionDetails) : actionDetails;

    const query = `
      INSERT INTO system_logs (
        user_id, username, action_type, entity_type, entity_id,
        action_details, old_data, new_data, ip_address, user_agent,
        status, error_message, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING *;
    `;

    const values = [
      userId,
      finalUsername,
      actionType,
      entityType,
      entityId,
      JSON.stringify(details),
      oldData ? JSON.stringify(oldData) : null,
      newData ? JSON.stringify(newData) : null,
      ipAddress,
      userAgent,
      status,
      errorMessage,
    ];

    const result = await safeQuery(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error logging system action:', error);
    return null;
  }
};

// ==========================================
// ENSURE TABLE FUNCTION
// ==========================================
async function ensureTable(tableName) {
  if (createdTables.has(tableName)) return;

  let createSQL = "";

  switch (tableName) {
    case "user_type":
      createSQL = `
        CREATE TABLE IF NOT EXISTS user_type (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;
    case "system_logs":
      createSQL = `
        CREATE TABLE IF NOT EXISTS system_logs (
          id SERIAL PRIMARY KEY,
          user_id INT,
          username VARCHAR(255),
          action_type VARCHAR(50) NOT NULL,
          entity_type VARCHAR(50) NOT NULL,
          entity_id INT,
          action_details JSONB,
          old_data JSONB,
          new_data JSONB,
          ip_address VARCHAR(45),
          user_agent TEXT,
          status VARCHAR(20) DEFAULT 'success',
          error_message TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
        CREATE INDEX IF NOT EXISTS idx_system_logs_action_type ON system_logs(action_type);
        CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
        CREATE INDEX IF NOT EXISTS idx_system_logs_entity_type ON system_logs(entity_type);
      `;
      break;

    case "username_history":
      createSQL = `
        CREATE TABLE IF NOT EXISTS username_history (
          id SERIAL PRIMARY KEY,
          user_id INT,
          platform VARCHAR(255),
          old_username VARCHAR(255),
          account_id INT,
          changed_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "email_history":
      createSQL = `
        CREATE TABLE IF NOT EXISTS email_history (
          id SERIAL PRIMARY KEY,
          user_id INT,
          platform VARCHAR(255),
          old_email VARCHAR(255),
          account_id INT,
          changed_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "accounts_history":
      createSQL = `
        CREATE TABLE IF NOT EXISTS accounts_history (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          platform VARCHAR(50) NOT NULL,
          old_password TEXT,
          account_id INT,
          changed_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "social_media_backupcodes":
      createSQL = `
        CREATE TABLE IF NOT EXISTS social_media_backupcodes (
          id SERIAL PRIMARY KEY,
          social_media_account_id INT,
          platform VARCHAR(255),
          backup_code VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "expenses_logs":
      createSQL = `
        CREATE TABLE IF NOT EXISTS expenses_logs (
          id SERIAL PRIMARY KEY,
          expense_id INT,
          field_name VARCHAR(255),
          old_value TEXT,
          new_value TEXT,
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "remaining_package_logs":
      createSQL = `
        CREATE TABLE IF NOT EXISTS remaining_package_logs (
          id SERIAL PRIMARY KEY,
          accounting_id INT NOT NULL REFERENCES accounting_invoices(id) ON DELETE CASCADE,
          previous_value VARCHAR(255),
          updated_at TIMESTAMP DEFAULT NOW(),
          old_value VARCHAR(255),
          new_value VARCHAR(255),
          updated_value VARCHAR(255),
          changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      break;

    case "Accounting":
      createSQL = `
        CREATE TABLE IF NOT EXISTS "Accounting" (
          id SERIAL PRIMARY KEY,
          plan_date DATE,
          amount NUMERIC,
          username VARCHAR(255),
          type VARCHAR(255),
          price_on_me NUMERIC,
          remaining NUMERIC,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "accounting_invoices":
      createSQL = `
        CREATE TABLE IF NOT EXISTS accounting_invoices (
          id SERIAL PRIMARY KEY,
          user_id INT,
          username VARCHAR(255),
          phone_number VARCHAR(50),
          email VARCHAR(255),
          package VARCHAR(255),
          remaining_package VARCHAR(255),
          remaining_changed VARCHAR(255),
          amount NUMERIC,
          price_on_me NUMERIC,
          plan_date DATE,
          is_paid BOOLEAN,
          countrycode VARCHAR(10),
          address TEXT,
          nationality VARCHAR(255),
          remaining_payment NUMERIC,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "accounting_logs":
      createSQL = `
        CREATE TABLE IF NOT EXISTS accounting_logs (
          id SERIAL PRIMARY KEY,
          accounting_id INT NOT NULL,
          field_name VARCHAR(255) NOT NULL,
          old_value TEXT,
          new_value TEXT,
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "job_descriptions":
      createSQL = `
        CREATE TABLE IF NOT EXISTS job_descriptions (
          id SERIAL PRIMARY KEY,
          job_description TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "quotation_v":
      createSQL = `
        CREATE TABLE IF NOT EXISTS quotation_v (
          id SERIAL PRIMARY KEY,
          plan_date DATE,
          amount NUMERIC,
          username VARCHAR(255),
          type VARCHAR(255),
          remaining NUMERIC,
          ispaid BOOLEAN,
          phone_number VARCHAR(50),
          country_code VARCHAR(10),
          country VARCHAR(100),
          price NUMERIC,
          nationality VARCHAR(255),
          address TEXT,
          email VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "tasks":
      createSQL = `
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          text TEXT,
          number INT,
          date TIMESTAMP DEFAULT NOW(),
          status VARCHAR(50) DEFAULT 'Pending'
        );
      `;
      break;

    case "maintenance":
      createSQL = `
        CREATE TABLE IF NOT EXISTS maintenance (
          id SERIAL PRIMARY KEY,
          text TEXT,
          number INT,
          date TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "recovered_accounts":
      createSQL = `
        CREATE TABLE IF NOT EXISTS recovered_accounts (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255),
          instagram VARCHAR(255),
          facebook VARCHAR(255),
          snapchat VARCHAR(255),
          linkedin VARCHAR(255),
          tiktok VARCHAR(255),
          facebook_password VARCHAR(255),
          snapchat_password VARCHAR(255),
          linkedin_password VARCHAR(255),
          tiktok_password VARCHAR(255),
          instagram_password VARCHAR(255),
          instagram_email VARCHAR(255),
          facebook_email VARCHAR(255),
          snapchat_email VARCHAR(255),
          linkedin_email VARCHAR(255),
          tiktok_email VARCHAR(255),
          email VARCHAR(255),
          twitter VARCHAR(255),
          twitter_password VARCHAR(255),
          twitter_email VARCHAR(255),
          gmail_username VARCHAR(255),
          gmail_password VARCHAR(255),
          gmail_email VARCHAR(255),
          email_username VARCHAR(255),
          email_password VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "old_passwords":
      createSQL = `
        CREATE TABLE IF NOT EXISTS old_passwords (
          id SERIAL PRIMARY KEY,
          account_id INT,
          old_password VARCHAR(255),
          platform_name VARCHAR(50),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "expensives":
      createSQL = `
        CREATE TABLE IF NOT EXISTS expensives (
          id SERIAL PRIMARY KEY,
          text TEXT,
          amount NUMERIC,
          date DATE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "images":
      createSQL = `
        CREATE TABLE IF NOT EXISTS images (
          id SERIAL PRIMARY KEY,
          user_id INT,
          image BYTEA,
          image_type VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "images_employee":
      createSQL = `
        CREATE TABLE IF NOT EXISTS images_employee (
          id SERIAL PRIMARY KEY,
          employee_id INT,
          image BYTEA,
          image_type VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "sm_users":
      createSQL = `
        CREATE TABLE IF NOT EXISTS sm_users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255),
          nationality VARCHAR(100),
          date_of_birth DATE,
          address TEXT,
          phonenumber VARCHAR(50),
          email VARCHAR(255),
          countrycode VARCHAR(10),
          gender VARCHAR(10),
          isverified BOOLEAN,
          image BYTEA,
          image_content_type VARCHAR(50),
          business_name VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "employee":
      createSQL = `
        CREATE TABLE IF NOT EXISTS employee (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255),
          nationality VARCHAR(100),
          date_of_birth DATE,
          address TEXT,
          phonenumber VARCHAR(50),
          email VARCHAR(255),
          countrycode VARCHAR(10),
          gender VARCHAR(10),
          isverified BOOLEAN,
          job_description TEXT,
          salary NUMERIC DEFAULT 0,
          image BYTEA,
          image_content_type VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "social_media_accounts":
      createSQL = `
        CREATE TABLE IF NOT EXISTS social_media_accounts (
          id SERIAL PRIMARY KEY,
          user_id INT,
          instagram VARCHAR(255),
          facebook VARCHAR(255),
          snapchat VARCHAR(255),
          linkedin VARCHAR(255),
          tiktok VARCHAR(255),
          twitter VARCHAR(255),
          gmail VARCHAR(255),
          hotmail VARCHAR(255),
          instagram_password VARCHAR(255),
          facebook_password VARCHAR(255),
          snapchat_password VARCHAR(255),
          linkedin_password VARCHAR(255),
          tiktok_password VARCHAR(255),
          twitter_password VARCHAR(255),
          gmail_password VARCHAR(255),
          hotmail_password VARCHAR(255),
          instagram_email VARCHAR(255),
          facebook_email VARCHAR(255),
          snapchat_email VARCHAR(255),
          linkedin_email VARCHAR(255),
          tiktok_email VARCHAR(255),
          twitter_email VARCHAR(255),
          gmail_email VARCHAR(255),
          hotmail_email VARCHAR(255),
          instagram_backupcode VARCHAR(255),
          facebook_backupcode VARCHAR(255),
          snapchat_backupcode VARCHAR(255),
          linkedin_backupcode VARCHAR(255),
          tiktok_backupcode VARCHAR(255),
          twitter_backupcode VARCHAR(255),
          gmail_backupcode VARCHAR(255),
          hotmail_backupcode VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "credit_cards":
      createSQL = `
        CREATE TABLE IF NOT EXISTS credit_cards (
          id SERIAL PRIMARY KEY,
          card_holder_name VARCHAR(255),
          card_number VARCHAR(255),
          expiration_date DATE,
          cvv VARCHAR(255),
          billing_address TEXT,
          user_id INT,
          card_type VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "admins":
      createSQL = `
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE,
          password VARCHAR(255),
          user_type VARCHAR(50),
          token TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    case "salary":
      createSQL = `
        CREATE TABLE IF NOT EXISTS salary (
          id SERIAL PRIMARY KEY,
          employee_id INT,
          job_description TEXT,
          salary NUMERIC,
          is_paid BOOLEAN,
          service TEXT,
          date DATE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      break;

    default:
      console.log(`No create SQL defined for table: ${tableName}`);
      return;
  }

  await client.query(createSQL);
  createdTables.add(tableName);
  console.log(`Created table: ${tableName}`);
}

// ==========================================
// SAFE QUERY WRAPPER
// ==========================================
async function safeQuery(sql, params = []) {
  const tableRegex = /(?:FROM|INTO|UPDATE)\s+("?[\w]+"?)/i;
  const match = sql.match(tableRegex);

  if (match) {
    const tableName = match[1].replace(/"/g, "");
    if (tables.includes(tableName)) {
      await ensureTable(tableName);
    }
  }

  return client.query(sql, params);
}

// ==========================================
// USER TYPE ROUTES
// ==========================================

// GET all user types
app.get("/api/user_type", async (req, res) => {
  try {
    const result = await safeQuery(
      "SELECT * FROM user_type ORDER BY type ASC"
    );

    return res.status(200).json(result.rows);

  } catch (error) {
    console.error("GET user_type error:", error);

    return res.status(500).json({
      error: error.message
    });
  }
});

// POST create user type
app.post("/api/user_type", async (req, res) => {
  try {

    console.log("BODY RECEIVED:", req.body);

const { type, description } = req.body || {};

    if (!type || type.trim() === "") {
      return res.status(400).json({
        error: "Type is required"
      });
    }


    const result = await safeQuery(
      `
      INSERT INTO user_type (type, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [
        type.trim(),
        description?.trim() || null
      ]
    );

res.status(201).json({
    message: "User type created successfully",
    data: result.rows[0]
});


try {
    await logSystemAction({
        actionType: "create",
        entityType: "user_type",
        entityId: result.rows[0].id,
        actionDetails: { type, description },
        newData: result.rows[0],
        req,
        status: "success",
    });
} catch (logError) {
    console.error("Log error:", logError);
}


  } catch (error) {

    console.error("Error creating user type:", error);

  res.status(500).json({
      error: "Internal Server Error"
    });
    await logSystemAction({
      actionType: "create",
      entityType: "user_type",
      status: "error",
      errorMessage: error.message,
      req
    });



  }
});

// PUT update user type
app.put("/api/user_type/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const { type, description } = req.body || {};


    if (!type || type.trim() === "") {
      return res.status(400).json({
        error: "Type is required"
      });
    }


    const oldData = await safeQuery(
      "SELECT * FROM user_type WHERE id = $1",
      [id]
    );


    if (oldData.rows.length === 0) {
      return res.status(404).json({
        error: "User type not found"
      });
    }



    const result = await safeQuery(
      `
      UPDATE user_type
      SET type = $1,
          description = $2
      WHERE id = $3
      RETURNING *
      `,
      [
        type.trim(),
        description?.trim() || null,
        id
      ]
    );



    await logSystemAction({
      actionType: "update",
      entityType: "user_type",
      entityId: parseInt(id),
      oldData: oldData.rows[0],
      newData: result.rows[0],
      req,
      status: "success"
    });



    res.status(200).json({
      message: "User type updated successfully",
      data: result.rows[0]
    });



  } catch (error) {

    console.error("Error updating user type:", error);


    await logSystemAction({
      actionType: "update",
      entityType: "user_type",
      entityId: parseInt(req.params.id),
      status: "error",
      errorMessage: error.message,
      req
    });


    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

// DELETE user type
app.delete("/api/user_type/:id", async (req, res) => {

  try {

    const { id } = req.params;


    const oldData = await safeQuery(
      "SELECT * FROM user_type WHERE id = $1",
      [id]
    );


    if (oldData.rows.length === 0) {
      return res.status(404).json({
        error: "User type not found"
      });
    }



    const result = await safeQuery(
      `
      DELETE FROM user_type
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );



    await logSystemAction({
      actionType: "delete",
      entityType: "user_type",
      entityId: parseInt(id),
      oldData: result.rows[0],
      req,
      status: "success"
    });



    res.status(200).json({
      message: "User type deleted successfully"
    });



  } catch (error) {

    console.error("Error deleting user type:", error);


    await logSystemAction({
      actionType: "delete",
      entityType: "user_type",
      entityId: parseInt(req.params.id),
      status: "error",
      errorMessage: error.message,
      req
    });


    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

// ==========================================
// CREATE ALL TABLES
// ==========================================
async function createAllTables() {
  for (const table of tables) {
    await ensureTable(table);
  }
}

// ==========================================
// DATABASE CONNECTION
// ==========================================
client.connect(async function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  await createAllTables();
  console.log("Connected to the pg server.");
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "A232dsaddsdasXXZ",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// ==========================================
// ADMIN AUTHENTICATION ROUTES
// ==========================================

// ==========================================
// ADMIN LOGIN ROUTE
// ==========================================
app.post("/admins", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const selectQuery = 'SELECT id, username, password, user_type FROM "admins" WHERE username = $1';
    const result = await safeQuery(selectQuery, [username]);

    if (result.rows.length === 0) {
      await logSystemAction({
        username: username,
        actionType: 'login',
        entityType: 'system',
        status: 'error',
        errorMessage: 'Invalid username',
        req,
      });
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const admin = result.rows[0];
    
    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      await logSystemAction({
        username: username,
        actionType: 'login',
        entityType: 'system',
        status: 'error',
        errorMessage: 'Invalid password',
        req,
      });
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, userType: admin.user_type },
      secretKey,
      { expiresIn: '24h' }
    );

    await safeQuery(
      'UPDATE "admins" SET token = $1 WHERE id = $2',
      [token, admin.id]
    );

    await logSystemAction({
      userId: admin.id,
      username: admin.username,
      actionType: 'login',
      entityType: 'system',
      status: 'success',
      actionDetails: { userType: admin.user_type },
      req,
    });

    res.status(200).json({
      message: "Login successful",
      userType: admin.user_type || 'admin',
      token: token,
      username: admin.username,
    });

  } catch (error) {
    console.error("Login error:", error);
    await logSystemAction({
      username: username,
      actionType: 'login',
      entityType: 'system',
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// ADMIN LOGOUT ROUTE
// ==========================================
app.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await safeQuery(
        'UPDATE "admins" SET token = NULL WHERE token = $1',
        [token]
      );
    }
    
    await logSystemAction({
      actionType: 'logout',
      entityType: 'system',
      status: 'success',
      req,
    });
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// VERIFY TOKEN ROUTE
// ==========================================
app.get("/verify-token", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ valid: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, secretKey);
    const result = await safeQuery(
      'SELECT id, username, user_type FROM "admins" WHERE id = $1 AND token = $2',
      [decoded.id, token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    res.status(200).json({ 
      valid: true, 
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        userType: result.rows[0].user_type,
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
});

// ==========================================
// GET ALL ADMINS (Protected)
// ==========================================
app.get("/admins", async (req, res) => {
  try {
    const result = await safeQuery(
      'SELECT id, username, user_type, created_at FROM "admins" ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// CREATE ADMIN (Protected)
// ==========================================
app.post("/AddAdmin", async (req, res) => {
  const { username, password, user_type } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if admin already exists
    const existing = await safeQuery(
      'SELECT id FROM "admins" WHERE username = $1',
      [username]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate token
    const token = jwt.sign({ username: username }, secretKey, { expiresIn: '24h' });

    // Insert admin
    await safeQuery(
      'INSERT INTO "admins" (username, password, user_type, token) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, user_type || 'admin', token]
    );

    await logSystemAction({
      username: username,
      actionType: 'create',
      entityType: 'admin',
      actionDetails: { userType: user_type || 'admin' },
      status: 'success',
      req,
    });

    res.status(201).json({ 
      message: "Admin created successfully",
      username: username,
      userType: user_type || 'admin'
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    await logSystemAction({
      username: username,
      actionType: 'create',
      entityType: 'admin',
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// DELETE ADMIN (Protected)
// ==========================================
app.delete("/admins/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await safeQuery(
      'DELETE FROM "admins" WHERE id = $1 RETURNING username',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await logSystemAction({
      username: result.rows[0].username,
      actionType: 'delete',
      entityType: 'admin',
      status: 'success',
      req,
    });

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// SYSTEM LOGS API ENDPOINTS
// ==========================================

app.get("/api/system-logs", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      actionType,
      entityType,
      userId,
      status,
      startDate,
      endDate,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (actionType) {
      conditions.push(`action_type = $${paramIndex++}`);
      values.push(actionType);
    }
    if (entityType) {
      conditions.push(`entity_type = $${paramIndex++}`);
      values.push(entityType);
    }
    if (userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      values.push(userId);
    }
    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(startDate);
    }
    if (endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(endDate);
    }
    if (search) {
      conditions.push(`(
        username ILIKE $${paramIndex} OR 
        action_type ILIKE $${paramIndex} OR 
        entity_type ILIKE $${paramIndex} OR
        action_details::text ILIKE $${paramIndex}
      )`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const countQuery = `SELECT COUNT(*) as total FROM system_logs ${whereClause}`;
    const countResult = await safeQuery(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    const dataQuery = `
      SELECT * FROM system_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    values.push(limit, offset);

    const result = await safeQuery(dataQuery, values);

    const summaryQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as success_count,
        COUNT(CASE WHEN status = 'error' THEN 1 END) as error_count,
        COUNT(DISTINCT action_type) as action_types,
        COUNT(DISTINCT entity_type) as entity_types
      FROM system_logs
      ${whereClause}
    `;
    const summaryResult = await safeQuery(summaryQuery, conditions.length > 0 ? values.slice(0, -2) : []);
    const summary = summaryResult.rows[0];

    const actionBreakdownQuery = `
      SELECT action_type, COUNT(*) as count
      FROM system_logs
      ${whereClause}
      GROUP BY action_type
      ORDER BY count DESC
    `;
    const actionBreakdownResult = await safeQuery(actionBreakdownQuery, conditions.length > 0 ? values.slice(0, -2) : []);
    const actionBreakdown = actionBreakdownResult.rows;

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary,
      actionBreakdown,
    });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    res.status(500).json({ error: 'Failed to fetch system logs' });
  }
});

app.get("/api/system-logs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await safeQuery('SELECT * FROM system_logs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Log entry not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching system log:', error);
    res.status(500).json({ error: 'Failed to fetch system log' });
  }
});

app.delete("/api/system-logs", async (req, res) => {
  try {
    const { days } = req.query;
    let query = 'DELETE FROM system_logs';
    let values = [];
    
    if (days) {
      query += ' WHERE created_at < NOW() - INTERVAL \'$1 days\'';
      values = [days];
    }
    
    const result = await safeQuery(query, values);
    res.json({ 
      message: `System logs cleared successfully`, 
      deleted: result.rowCount 
    });
  } catch (error) {
    console.error('Error clearing system logs:', error);
    res.status(500).json({ error: 'Failed to clear system logs' });
  }
});

// ==========================================
// GET USERNAME HISTORY
// ==========================================
app.get("/api/get-username-history/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const { rows } = await safeQuery(
      "SELECT id, account_id, old_username, platform, changed_at FROM username_history WHERE user_id = $1 ORDER BY changed_at DESC",
      [user_id]
    );
    res.status(200).json({ history: rows });
  } catch (error) {
    console.error("Error fetching username history:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// ==========================================
// GET PASSWORD HISTORY
// ==========================================
app.get("/api/get-password-history/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const query = `
      SELECT platform, old_password, changed_at, account_id
      FROM accounts_history
      WHERE user_id = $1
      ORDER BY platform, changed_at DESC
    `;
    const result = await safeQuery(query, [user_id]);
    res.status(200).json({ history: result.rows });
  } catch (error) {
    console.error("Error fetching password history:", error);
    res.status(500).json({ 
      error: "Database query failed",
      details: error.message 
    });
  }
});

// ==========================================
// GET EMAIL HISTORY
// ==========================================
app.get("/api/get-email-history/:user_id", async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const query = `
    SELECT platform, old_email, changed_at, account_id
    FROM email_history
    WHERE user_id = $1
    ORDER BY platform, changed_at DESC
  `;

  try {
    const result = await safeQuery(query, [user_id]);
    res.status(200).json({ history: result.rows });
  } catch (error) {
    console.error("Error fetching email history:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// ==========================================
// ADD BACKUP CODE
// ==========================================
app.post("/api/add-backup-code", async (req, res) => {
  const { backupcode, platform, id } = req.body;

  const insertQuery = `
    INSERT INTO public.social_media_backupcodes (social_media_account_id, platform, backup_code) 
    VALUES ($1, $2, $3);
  `;

  const values = [id, platform, backupcode];

  try {
    await safeQuery(insertQuery, values);
    
    await logSystemAction({
      actionType: 'create',
      entityType: 'backup_code',
      entityId: id,
      actionDetails: { platform, backupcode },
      req,
      status: 'success',
    });
    
    res.status(204).send();
  } catch (err) {
    console.error(err);
    await logSystemAction({
      actionType: 'create',
      entityType: 'backup_code',
      entityId: id,
      actionDetails: { platform },
      status: 'error',
      errorMessage: err.message,
      req,
    });
    res.status(500).send({ error: err });
  }
});

// ==========================================
// UPDATE USER FIELD
// ==========================================
app.put("/api/update-user-field", async (req, res) => {
  const { user_id, field, value } = req.body;

  if (!user_id || !field || value === undefined) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  const validFields = [
    "date_of_birth",
    "username",
    "nationality",
    "address",
    "email",
    "countrycode",
    "phonenumber",
    "gender",
    "business_name"
  ];
  if (!validFields.includes(field)) {
    return res.status(400).json({ error: "Invalid field" });
  }

  try {
    const oldDataResult = await safeQuery(
      `SELECT ${field} FROM sm_users WHERE id = $1`,
      [user_id]
    );
    const oldValue = oldDataResult.rows[0]?.[field];

    const finalValue = field === "phonenumber" ? parseInt(value, 10) : value;

    const query = `UPDATE sm_users SET ${field} = $1 WHERE id = $2`;
    const result = await safeQuery(query, [finalValue, user_id]);

    if (result.rowCount === 0) {
      await logSystemAction({
        userId: user_id,
        actionType: 'update',
        entityType: 'user',
        entityId: user_id,
        actionDetails: { field, attemptedValue: value },
        oldData: { [field]: oldValue },
        status: 'error',
        errorMessage: 'User not found',
        req,
      });
      return res.status(404).json({ error: "User not found" });
    }

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'user',
      entityId: user_id,
      actionDetails: { field, newValue: finalValue },
      oldData: { [field]: oldValue },
      newData: { [field]: finalValue },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Field updated successfully" });
  } catch (error) {
    console.error("Error updating user field:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'user',
      entityId: user_id,
      actionDetails: { field },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed" });
  }
});

// ==========================================
// UPDATE EMPLOYEE PROFILE
// ==========================================
app.put("/api/update-employee-profile", async (req, res) => {
  const { 
    user_id, 
    username, 
    nationality, 
    date_of_birth, 
    job_description,
    salary,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const fieldsToUpdate = [];
    const values = [];

    const addField = (fieldName, value) => {
      if (value !== undefined && value !== null) {
        fieldsToUpdate.push(`${fieldName} = $${values.length + 1}`);
        values.push(value);
      }
    };

    addField('username', username);
    addField('nationality', nationality);
    addField('date_of_birth', date_of_birth);
    addField('job_description', job_description);
    addField('salary', salary ? parseFloat(salary) : null);

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No valid fields provided." });
    }

    values.push(user_id);

    const query = `UPDATE employee SET ${fieldsToUpdate.join(', ')} WHERE id = $${values.length}`;
    
    const result = await safeQuery(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found." });
    }

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'employee',
      entityId: user_id,
      actionDetails: { updatedFields: fieldsToUpdate.map(f => f.split('=')[0].trim()) },
      req,
      status: 'success',
    });

    res.status(200).json({ 
      message: "Employee profile updated successfully." 
    });
  } catch (error) {
    console.error("Error updating employee profile:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'employee',
      entityId: user_id,
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed." });
  }
});

// ==========================================
// UPDATE CLIENT PROFILE
// ==========================================
app.put("/api/update-client-profile", async (req, res) => {
  const { 
    user_id, 
    username, 
    nationality, 
    business_name, 
    address, 
    phonenumber, 
    countrycode, 
    date_of_birth 
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const fieldsToUpdate = [];
    const values = [];

    const addField = (fieldName, value) => {
      if (value !== undefined && value !== null) {
        fieldsToUpdate.push(`${fieldName} = $${values.length + 1}`);
        values.push(value);
      }
    };

    addField('username', username);
    addField('nationality', nationality);
    addField('business_name', business_name);
    addField('address', address);
    addField('phonenumber', phonenumber);
    addField('countrycode', countrycode);
    addField('date_of_birth', date_of_birth);

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No valid fields provided to update." });
    }

    values.push(user_id);

    const query = `UPDATE sm_users SET ${fieldsToUpdate.join(', ')} WHERE id = $${values.length}`;
    
    const result = await safeQuery(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'user',
      entityId: user_id,
      actionDetails: { updatedFields: fieldsToUpdate.map(f => f.split('=')[0].trim()) },
      req,
      status: 'success',
    });

    res.status(200).json({ 
      message: "Client profile updated successfully.", 
      updatedFields: fieldsToUpdate.length 
    });
  } catch (error) {
    console.error("Error updating client profile:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'user',
      entityId: user_id,
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed." });
  }
});

// ==========================================
// UPDATE SOCIAL MEDIA USERNAME
// ==========================================
app.put("/api/update-social-media-username", async (req, res) => {
  const { user_id, id, platform, new_username } = req.body;

  if (!user_id || !platform || !new_username) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  const validPlatforms = [
    "instagram",
    "facebook",
    "snapchat",
    "linkedin",
    "tiktok",
    "hotmail",
    "gmail",
    "twitter",
  ];
  if (!validPlatforms.includes(platform)) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  const platformColumn = `${platform}`;

  try {
    await safeQuery("BEGIN");

    const { rows } = await safeQuery(
      `SELECT ${platformColumn} FROM social_media_accounts WHERE user_id = $1 and id = $2`,
      [user_id, id]
    );
    const oldUsername = rows[0] ? rows[0][platformColumn] : null;

    await safeQuery(
      `INSERT INTO username_history (user_id, platform, old_username, account_id)
       VALUES ($1, $2, $3, $4)`,
      [user_id, platform, oldUsername, id]
    );

    await safeQuery(
      `UPDATE social_media_accounts SET ${platformColumn} = $1 WHERE user_id = $2 and id = $3`,
      [new_username, user_id, id]
    );

    await safeQuery("COMMIT");

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'username', oldValue: oldUsername, newValue: new_username },
      oldData: { [platform]: oldUsername },
      newData: { [platform]: new_username },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Username updated successfully", oldUsername });
  } catch (error) {
    await safeQuery("ROLLBACK");
    console.error("Error updating username:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'username' },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed" });
  }
});

// ==========================================
// UPDATE SOCIAL MEDIA PASSWORD
// ==========================================
app.put("/api/update-social-media-password", async (req, res) => {
  const { user_id, platform, new_password, id } = req.body;

  if (!user_id || !platform || !new_password) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  const validPlatforms = [
    "instagram",
    "facebook",
    "snapchat",
    "linkedin",
    "tiktok",
    "gmail",
    "hotmail",
    "twitter",
  ];
  if (!validPlatforms.includes(platform)) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  const platformColumn = `${platform.toLowerCase()}_password`;

  try {
    await safeQuery("BEGIN");

    const checkQuery = await safeQuery(
      `SELECT id FROM social_media_accounts WHERE user_id = $1 AND id = $2`,
      [user_id, id]
    );
    
    if (checkQuery.rows.length === 0) {
      await safeQuery("ROLLBACK");
      return res.status(404).json({ error: "Social media account not found" });
    }

    const { rows } = await safeQuery(
      `SELECT ${platformColumn} FROM social_media_accounts WHERE user_id = $1 AND id = $2`,
      [user_id, id]
    );
    
    const oldPassword = rows[0] ? rows[0][platformColumn] : null;

    await safeQuery(
      `UPDATE social_media_accounts SET ${platformColumn} = $1 WHERE user_id = $2 AND id = $3`,
      [new_password, user_id, id]
    );

    if (oldPassword) {
      await safeQuery(
        `INSERT INTO accounts_history (user_id, platform, old_password, account_id, changed_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        [user_id, platform.toLowerCase(), oldPassword, id]
      );
    }

    await safeQuery("COMMIT");

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'password' },
      oldData: { password: oldPassword },
      req,
      status: 'success',
    });

    res.status(200).json({ 
      message: "Password updated successfully",
      old_password: oldPassword 
    });
  } catch (error) {
    await safeQuery("ROLLBACK");
    console.error("Error updating password:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'password' },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ 
      error: "Database update failed", 
      details: error.message 
    });
  }
});

// ==========================================
// UPDATE SOCIAL MEDIA EMAIL
// ==========================================
app.put("/api/update-social-media-email", async (req, res) => {
  const { user_id, platform, new_email, id } = req.body;

  if (!user_id || !platform || new_email === undefined) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  const validPlatforms = [
    "instagram",
    "facebook",
    "snapchat",
    "linkedin",
    "tiktok",
    "gmail",
    "hotmail",
    "twitter",
  ];
  if (!validPlatforms.includes(platform)) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  const platformColumn = `${platform.toLowerCase()}_email`;

  try {
    await safeQuery("BEGIN");

    const { rows } = await safeQuery(
      `SELECT ${platformColumn} FROM social_media_accounts WHERE user_id = $1 AND id = $2`,
      [user_id, id]
    );
    const oldEmail = rows[0]?.[platformColumn];

    await safeQuery(
      `UPDATE social_media_accounts SET ${platformColumn} = $1 WHERE user_id = $2 AND id = $3`,
      [new_email, user_id, id]
    );

    await safeQuery(
      "INSERT INTO email_history (user_id, platform, old_email, account_id) VALUES ($1, $2, $3, $4)",
      [user_id, platform.toLowerCase(), oldEmail, id]
    );

    await safeQuery("COMMIT");

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'email', oldValue: oldEmail, newValue: new_email },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    await safeQuery("ROLLBACK");
    console.error("Error updating email:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'email' },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed" });
  }
});

// ==========================================
// UPDATE SOCIAL MEDIA BACKUP CODE
// ==========================================
app.put("/api/update-social-media-backupcode", async (req, res) => {
  const { user_id, platform, new_email, id } = req.body;

  if (!user_id || !platform || !new_email) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  const validPlatforms = [
    "instagram",
    "facebook",
    "snapchat",
    "linkedin",
    "tiktok",
    "gmail",
    "twitter",
  ];
  if (!validPlatforms.includes(platform)) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  const platformColumn = `${platform.toLowerCase()}_backupcode`;

  try {
    await safeQuery("BEGIN");

    const { rows } = await safeQuery(
      `SELECT ${platformColumn} FROM social_media_accounts WHERE user_id = $1 and id = $2`,
      [user_id, id]
    );
    const oldBackupCode = rows[0]?.[platformColumn];

    await safeQuery(
      `UPDATE social_media_accounts SET ${platformColumn} = $1 WHERE user_id = $2 and id = $3`,
      [new_email, user_id, id]
    );

    await safeQuery("COMMIT");

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'backupcode', oldValue: oldBackupCode, newValue: new_email },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Backup code updated successfully" });
  } catch (error) {
    await safeQuery("ROLLBACK");
    console.error("Error updating backup code:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'social_media',
      entityId: id,
      actionDetails: { platform, field: 'backupcode' },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed" });
  }
});

// ==========================================
// UPDATE BACKUP CODE (individual)
// ==========================================
app.put("/api/update-backupcode", async (req, res) => {
  const { user_id, platform, new_email, id, backupcode_id } = req.body;

  if (!user_id || !platform || !new_email) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  const validPlatforms = [
    "instagram",
    "facebook",
    "snapchat",
    "linkedin",
    "tiktok",
    "gmail",
    "twitter",
  ];
  if (!validPlatforms.includes(platform)) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  try {
    await safeQuery("BEGIN");

    const { rows } = await safeQuery(
      `SELECT backup_code FROM social_media_backupcodes WHERE id = $1`,
      [backupcode_id]
    );
    const oldBackupCode = rows[0]?.backup_code;

    await safeQuery(
      `UPDATE social_media_backupcodes SET backup_code = $1 WHERE id = $2`,
      [new_email, backupcode_id]
    );

    await safeQuery("COMMIT");

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'backup_code',
      entityId: backupcode_id,
      actionDetails: { platform, oldValue: oldBackupCode, newValue: new_email },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Backup code updated successfully" });
  } catch (error) {
    await safeQuery("ROLLBACK");
    console.error("Error updating backup code:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'backup_code',
      entityId: backupcode_id,
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed" });
  }
});

// ==========================================
// DELETE BACKUP CODE
// ==========================================
app.delete("/api/delete-backupcode/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const oldData = await safeQuery(
      `SELECT * FROM social_media_backupcodes WHERE id = $1`,
      [id]
    );

    await safeQuery(`DELETE FROM social_media_backupcodes WHERE id = $1`, [id]);

    await logSystemAction({
      actionType: 'delete',
      entityType: 'backup_code',
      entityId: parseInt(id),
      oldData: oldData.rows[0] || null,
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Backup code deleted successfully" });
  } catch (error) {
    console.error("Error deleting backup code:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'backup_code',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database delete failed" });
  }
});

// ==========================================
// ADD SOCIAL MEDIA ACCOUNT
// ==========================================
app.post('/api/add-social-media-account', async (req, res) => {
  const { user_id, platform, username, email, password, backupcode } = req.body;

  const columnMap = {
    instagram: 'instagram',
    facebook: 'facebook',
    snapchat: 'snapchat',
    linkedin: 'linkedin',
    tiktok: 'tiktok',
    twitter: 'twitter',
    gmail: 'gmail',
    hotmail: 'hotmail',
  };

  const platformColumn = columnMap[platform];
  const passwordColumn = `${platform}_password`;
  const emailColumn = `${platform}_email`;
  const backupCodeColumn = `${platform}_backupcode`;

  if (!platformColumn || !user_id) {
    return res.status(400).json({ message: 'Invalid platform or user_id' });
  }

  try {
    const result = await safeQuery(
      `INSERT INTO social_media_accounts (user_id, ${platformColumn}, ${emailColumn}, ${passwordColumn}, ${backupCodeColumn}) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, username, email, password, backupcode]
    );
    
    await logSystemAction({
      userId: user_id,
      actionType: 'create',
      entityType: 'social_media',
      entityId: result.rows[0]?.id,
      actionDetails: { platform, username },
      newData: { platform, username, email },
      req,
      status: 'success',
    });
    
    res.status(200).json({ message: `${platform} account added successfully` });
  } catch (err) {
    console.error('Error adding account:', err);
    await logSystemAction({
      userId: user_id,
      actionType: 'create',
      entityType: 'social_media',
      actionDetails: { platform, username },
      status: 'error',
      errorMessage: err.message,
      req,
    });
    res.status(500).json({ message: 'Error adding account', error: err.message });
  }
});

// ==========================================
// DELETE SOCIAL MEDIA
// ==========================================
app.delete("/api/delete-social-media/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const socialMediaData = await safeQuery(
      `SELECT * FROM social_media_accounts WHERE id = $1`,
      [id]
    );

    await safeQuery(
      `DELETE FROM social_media_backupcodes WHERE social_media_account_id = $1`,
      [id]
    );

    const result = await safeQuery(
      `DELETE FROM social_media_accounts WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No social media record found with that id." });
    }

    await logSystemAction({
      actionType: 'delete',
      entityType: 'social_media',
      entityId: id,
      oldData: socialMediaData.rows[0] || null,
      req,
      status: 'success',
    });

    res.status(200).json({
      message: "Social media record deleted successfully.",
      deletedRecord: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting record:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'social_media',
      entityId: id,
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database delete failed", details: error.message });
  }
});

// ==========================================
// DELETE PLATFORM
// ==========================================
app.delete("/api/delete-platform/:platform/:id", async (req, res) => {
  const { platform, id } = req.params;

  if (!platform || !id) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    await safeQuery(
      `DELETE FROM social_media_backupcodes WHERE social_media_account_id = $1 AND LOWER(platform) = $2`,
      [id, platform.toLowerCase()]
    );

    await safeQuery(
      `DELETE FROM social_media_accounts WHERE id = $1 AND LOWER(platform) = $2`,
      [id, platform.toLowerCase()]
    );

    await logSystemAction({
      actionType: 'delete',
      entityType: 'platform',
      entityId: parseInt(id),
      actionDetails: { platform },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Platform deleted successfully" });
  } catch (error) {
    console.error("Error deleting platform:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'platform',
      entityId: parseInt(id),
      actionDetails: { platform },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database delete failed" });
  }
});

// ==========================================
// GET USERS
// ==========================================
app.get("/api/users", async (req, res) => {
  try {
    const result = await safeQuery(
      "select s.*, (select count(*) from images i where s.id = i.user_id) as count, (select sum(a1.amount) from accounting_invoices a1 where s.id = a1.user_id) as sum from sm_users s"
    );
    const users = result.rows.map((user) => {
      if (user.image) {
        return {
          ...user,
          image: `data:image/jpeg;base64,${user.image.toString("base64")}`,
        };
      }
      return user;
    });
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// ==========================================
// GET EMPLOYEES
// ==========================================
app.get("/api/employee", async (req, res) => {
  try {
    const result = await safeQuery(
      `SELECT s.*, 
              (SELECT count(*) FROM images_employee i WHERE s.id = i.employee_id) as count 
       FROM employee s`
    );
    
    const users = result.rows.map((user) => {
      if (user.image) {
        return {
          ...user,
          image: `data:image/jpeg;base64,${user.image.toString("base64")}`,
          salary: parseFloat(user.salary) || 0,
        };
      }
      return {
        ...user,
        salary: parseFloat(user.salary) || 0,
      };
    });
    
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// ==========================================
// GET ACCOUNTING DATA
// ==========================================
app.get("/api/AccountingData", async (req, res) => {
  try {
    const result = await safeQuery(`
      SELECT 
        id, user_id, username, phone_number, email, "package", 
        remaining_package, amount, price_on_me, plan_date, is_paid, remaining_changed,
        created_at, countrycode, address, nationality, remaining_payment
      FROM public.accounting_invoices
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching AccountingData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// GET ACCOUNTING BY ID
// ==========================================
app.get("/api/GetAccountingById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await safeQuery(
      `SELECT 
        id, user_id, username, phone_number, email, package, 
        remaining_package, amount, price_on_me, plan_date, is_paid,
        created_at, countrycode, address, nationality, remaining_payment,
        remaining_changed
       FROM public.accounting_invoices
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const record = result.rows[0];
    record.is_paid = !!record.is_paid;

    res.json(record);
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ message: "Error fetching record" });
  }
});

// ==========================================
// UPDATE ACCOUNTING
// ==========================================
app.put("/UpdateAccounting/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid accounting ID" });

  const {
    username,
    plan_date,
    amount,
    package: pkg,
    price_on_me,
    remaining_payment,
    remaining_package,
    is_paid,
    remaining_changed
  } = req.body;

  try {
    const { rows } = await safeQuery(
      `SELECT username, plan_date, amount, package, price_on_me, remaining_payment, remaining_package, remaining_changed, is_paid
       FROM accounting_invoices
       WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Record not found" });

    const oldRecord = rows[0];
    const normalizedPlanDate = plan_date ? new Date(plan_date).toISOString().split("T")[0] : null;

    await safeQuery(
      `UPDATE accounting_invoices
       SET username = COALESCE($1, username),
           plan_date = COALESCE($2, plan_date),
           amount = COALESCE($3, amount),
           package = COALESCE($4, package),
           price_on_me = COALESCE($5, price_on_me),
           remaining_payment = $6,
           remaining_package = $7,
           remaining_changed = $8,
           is_paid = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10`,
      [username, normalizedPlanDate, amount, pkg, price_on_me, remaining_payment, remaining_package, remaining_changed, is_paid, id]
    );

    await logSystemAction({
      actionType: 'update',
      entityType: 'invoice',
      entityId: id,
      actionDetails: { 
        updatedFields: Object.keys(req.body).filter(k => req.body[k] !== undefined)
      },
      oldData: oldRecord,
      newData: { username, plan_date, amount, package: pkg, price_on_me, remaining_payment, remaining_package, is_paid },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Record updated successfully", remaining_changed });
  } catch (err) {
    console.error(err);
    await logSystemAction({
      actionType: 'update',
      entityType: 'invoice',
      entityId: id,
      status: 'error',
      errorMessage: err.message,
      req,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==========================================
// CREATE ACCOUNTING INVOICE
// ==========================================
app.post("/api/accounting_invoices", async (req, res) => {
  const {
    userId,
    username,
    phoneNumber,
    email,
    package,
    remainingPackage,
    remaining_payment,
    amount,
    priceOnMe,
    planDate,
    isPaid,
    countrycode,
    address,
    nationality,
  } = req.body;

  try {
    const result = await safeQuery(
      `INSERT INTO accounting_invoices (user_id, username, phone_number, email, package, remaining_package, amount, price_on_me, plan_date, is_paid, countrycode, address, nationality, remaining_payment)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        userId,
        username,
        phoneNumber,
        email,
        package,
        remainingPackage,
        amount,
        priceOnMe,
        planDate,
        isPaid,
        countrycode,
        address,
        nationality,
        remaining_payment
      ]
    );
    
    await logSystemAction({
      userId: userId,
      actionType: 'create',
      entityType: 'invoice',
      entityId: result.rows[0]?.id,
      actionDetails: { username, amount, package },
      newData: result.rows[0],
      req,
      status: 'success',
    });
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    await logSystemAction({
      userId: userId,
      actionType: 'create',
      entityType: 'invoice',
      actionDetails: { username, amount },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error inserting data" });
  }
});

// ==========================================
// DELETE INVOICE
// ==========================================
app.delete("/api/Remove_Data/:id", async (req, res) => {
  const invoiceId = req.params.id;

  try {
    const invoiceData = await safeQuery(
      `SELECT * FROM public.accounting_invoices WHERE id = $1`,
      [invoiceId]
    );

    const result = await safeQuery(
      "DELETE FROM public.accounting_invoices WHERE id = $1 RETURNING *",
      [invoiceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    await logSystemAction({
      actionType: 'delete',
      entityType: 'invoice',
      entityId: parseInt(invoiceId),
      oldData: invoiceData.rows[0] || null,
      req,
      status: 'success',
    });

    res.status(200).json({
      message: "Invoice deleted successfully",
      invoice: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'invoice',
      entityId: parseInt(invoiceId),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error deleting invoice" });
  }
});

// ==========================================
// UPDATE IS PAID
// ==========================================
app.patch("/api/UpdateIsPaid/:id", async (req, res) => {
  const { id } = req.params;
  const { isPaid } = req.body;

  try {
    const oldData = await safeQuery(
      `SELECT is_paid FROM accounting_invoices WHERE id = $1`,
      [id]
    );

    const result = await safeQuery(
      "UPDATE accounting_invoices SET is_paid = $1 WHERE id = $2 RETURNING *",
      [isPaid, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Record not found");
    }

    await logSystemAction({
      actionType: 'update',
      entityType: 'invoice',
      entityId: parseInt(id),
      actionDetails: { field: 'is_paid', oldValue: oldData.rows[0]?.is_paid, newValue: isPaid },
      oldData: oldData.rows[0] || null,
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.send(result.rows[0]);
  } catch (error) {
    console.error("Error updating isPaid status:", error);
    await logSystemAction({
      actionType: 'update',
      entityType: 'invoice',
      entityId: parseInt(id),
      actionDetails: { field: 'is_paid' },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).send("Server error");
  }
});

// ==========================================
// CREATE QUOTATION
// ==========================================
app.post("/CreateQuotation", async (req, res) => {
  const {
    plan_date,
    amount,
    username,
    type,
    remaining,
    ispaid,
    phone_number,
    country_code,
    country,
    price,
    nationality,
    address,
    email, 
  } = req.body;

  const finalAmount = parseFloat(amount) || 0;
  const finalPrice = parseFloat(price) || 0;
  const finalRemaining = parseFloat(remaining) || 0; 

  const insertQuery = `
    INSERT INTO quotation_v (plan_date, amount, username, type, remaining, ispaid, phone_number, country_code, country, price, nationality, address, email)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
    RETURNING *`;

  try {
    const result = await safeQuery(insertQuery, [
      plan_date,
      finalAmount,
      username,
      type,
      finalRemaining,
      ispaid,
      phone_number,
      country_code,
      country,
      finalPrice,
      nationality,
      address,
      email,
    ]);
    
    await logSystemAction({
      actionType: 'create',
      entityType: 'quotation',
      entityId: result.rows[0]?.id,
      actionDetails: { username, amount: finalAmount, type },
      newData: result.rows[0],
      req,
      status: 'success',
    });
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding quotation:", error);
    await logSystemAction({
      actionType: 'create',
      entityType: 'quotation',
      actionDetails: { username, amount },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(400).json({ error: "Failed to add quotation" });
  }
});

// ==========================================
// GET QUOTATIONS
// ==========================================
app.get("/api/Quotation", (req, res) => {
  safeQuery(`SELECT * FROM quotation_v`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err);
      res.status(500).send("Error fetching data");
    }
  });
});

// ==========================================
// UPDATE QUOTATION
// ==========================================
app.put("/UpdateQuotation/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    plan_date,
    amount,
    username,
    type,
    phone_number,
    country,
    price,
    nationality,
    address,
    ispaid,
    remaining,
    email,
    country_code,
  } = req.body;

  const query = `
    UPDATE public.quotation_v
    SET 
      plan_date = $1,
      amount = $2,
      username = $3,
      type = $4,
      phone_number = $5,
      country = $6,
      price = $7,
      nationality = $8,
      address = $9,
      ispaid = $10,
      remaining = $11,
      email = $12,
      country_code = $13
    WHERE id = $14
    RETURNING *
  `;

  const values = [
    plan_date,
    amount,
    username,
    type,
    phone_number,
    country,
    price,
    nationality,
    address,
    ispaid,
    remaining,
    email,
    country_code,
    id,
  ];

  try {
    const oldData = await safeQuery(
      `SELECT * FROM quotation_v WHERE id = $1`,
      [id]
    );

    const result = await safeQuery(query, values);

    if (result.rows.length > 0) {
      await logSystemAction({
        actionType: 'update',
        entityType: 'quotation',
        entityId: id,
        actionDetails: { updatedFields: Object.keys(req.body) },
        oldData: oldData.rows[0] || null,
        newData: result.rows[0],
        req,
        status: 'success',
      });

      res.status(200).json({
        message: "Quotation updated successfully",
        updatedQuotation: result.rows[0],
      });
    } else {
      res.status(404).json({
        message: "Quotation not found",
      });
    }
  } catch (error) {
    console.error("Error updating quotation:", error);
    await logSystemAction({
      actionType: 'update',
      entityType: 'quotation',
      entityId: id,
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({
      message: "Error updating quotation",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE QUOTATION
// ==========================================
app.delete("/api/Remove_Quotation/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const oldData = await safeQuery(
      `SELECT * FROM quotation_v WHERE id = $1`,
      [id]
    );

    const deleteQuery = "DELETE FROM public.quotation_v WHERE id = $1 RETURNING *";
    const result = await safeQuery(deleteQuery, [id]);

    if (result.rows.length > 0) {
      await logSystemAction({
        actionType: 'delete',
        entityType: 'quotation',
        entityId: parseInt(id),
        oldData: oldData.rows[0] || null,
        req,
        status: 'success',
      });

      res.status(200).json({
        message: "Quotation deleted successfully.",
        deletedRecord: result.rows[0],
      });
    } else {
      res.status(404).json({
        message: "Quotation not found.",
      });
    }
  } catch (err) {
    console.error("Error deleting quotation:", err);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'quotation',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: err.message,
      req,
    });
    res.status(500).json({
      message: "Error deleting quotation.",
      error: err.message,
    });
  }
});

// ==========================================
// CREATE TASK
// ==========================================
app.post("/CreateTasks", async (req, res) => {
  const { text } = req.body;

  try {
    const maxResult = await safeQuery(`SELECT COALESCE(MAX(number), 0) AS max_number FROM "tasks"`);
    const maxNumber = parseInt(maxResult.rows[0].max_number, 10) || 0;
    const newTaskNumber = maxNumber + 1;

    const insertQuery = `INSERT INTO "tasks" (text, number, date, status) VALUES ($1, $2, NOW(), 'Pending') RETURNING *`;
    const result = await safeQuery(insertQuery, [text, newTaskNumber]);

    await logSystemAction({
      actionType: 'create',
      entityType: 'task',
      entityId: result.rows[0]?.id,
      actionDetails: { text, number: newTaskNumber },
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Task created successfully", id: result.rows[0]?.id || newTaskNumber });
  } catch (error) {
    console.error("Error creating task:", error);
    await logSystemAction({
      actionType: 'create',
      entityType: 'task',
      actionDetails: { text },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error creating task" });
  }
});

// ==========================================
// GET TASKS
// ==========================================
app.get("/viewtasks", (req, res) => {
  safeQuery(`SELECT * FROM "tasks" ORDER BY date ASC`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err);
      res.status(500).json({ error: "Error retrieving tasks" });
    }
  });
});

// ==========================================
// UPDATE TASK
// ==========================================
app.put("/api/updateTask/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!id || !text) {
    return res.status(400).json({ error: "Task ID and text are required." });
  }

  try {
    const oldData = await safeQuery(
      `SELECT text FROM public.tasks WHERE id = $1`,
      [id]
    );

    const query = `UPDATE public.tasks SET text = $1 WHERE id = $2 RETURNING *`;
    const values = [text, id];
    const result = await safeQuery(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    await logSystemAction({
      actionType: 'update',
      entityType: 'task',
      entityId: parseInt(id),
      actionDetails: { field: 'text', oldValue: oldData.rows[0]?.text, newValue: text },
      oldData: oldData.rows[0] || null,
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.status(200).json({ 
      message: "Task updated successfully.", 
      task: result.rows[0] 
    });
  } catch (error) {
    console.error("Error updating task:", error);
    await logSystemAction({
      actionType: 'update',
      entityType: 'task',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Database update failed." });
  }
});

// ==========================================
// UPDATE TASK STATUS
// ==========================================
app.put("/updateTaskStatus/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const updateStatusQuery = `UPDATE "tasks" SET status = $1 WHERE id = $2`;

  try {
    const oldData = await safeQuery(
      `SELECT status FROM tasks WHERE id = $1`,
      [taskId]
    );

    const result = await safeQuery(updateStatusQuery, [status, taskId]);

    await logSystemAction({
      actionType: 'update',
      entityType: 'task',
      entityId: parseInt(taskId),
      actionDetails: { field: 'status', oldValue: oldData.rows[0]?.status, newValue: status },
      req,
      status: 'success',
    });

    res.json({ message: "Task status updated successfully" });
  } catch (error) {
    console.error("Error updating task status:", error);
    await logSystemAction({
      actionType: 'update',
      entityType: 'task',
      entityId: parseInt(taskId),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error updating task status" });
  }
});

// ==========================================
// DELETE TASK
// ==========================================
app.delete("/delete-task/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const taskData = await safeQuery(
      `SELECT * FROM public.tasks WHERE id = $1`,
      [id]
    );

    const result = await safeQuery(
      `DELETE FROM public.tasks WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      await logSystemAction({
        actionType: 'delete',
        entityType: 'task',
        entityId: id,
        status: 'error',
        errorMessage: 'Task not found',
        req,
      });
      return res.status(404).json({ message: "Task not found." });
    }

    await logSystemAction({
      actionType: 'delete',
      entityType: 'task',
      entityId: id,
      actionDetails: { taskText: taskData.rows[0]?.text },
      oldData: taskData.rows[0],
      req,
      status: 'success',
    });

    res.status(200).json({ 
      message: "Task deleted successfully.", 
      deletedTask: result.rows[0] 
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'task',
      entityId: id,
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ message: "Database error while deleting task." });
  }
});

// ==========================================
// CREATE EXPENSE
// ==========================================
app.get("/api/expensivescurrentmonth", async (req, res) => {
  try {
    const query = `
      SELECT id, amount, text, date 
      FROM public.expensives 
      WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)
      ORDER BY date DESC
    `;
    const result = await safeQuery(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching current month expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get selected month expenses
app.get("/api/expensivesselectedmonth", async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: "Date parameter is required." });
  }

  try {
    const query = `
      SELECT id, amount, text, date 
      FROM public.expensives 
      WHERE TO_CHAR(date, 'YYYY-MM') = $1
      ORDER BY date DESC
    `;
    const result = await safeQuery(query, [date]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching selected month expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get selected year expenses
app.get("/api/expensivesselectedyear", async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: "Date parameter is required." });
  }

  try {
    const query = `
      SELECT id, amount, text, date 
      FROM public.expensives 
      WHERE TO_CHAR(date, 'YYYY') = $1
      ORDER BY date DESC
    `;
    const result = await safeQuery(query, [date]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching selected year expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// GET EXPENSE BY ID
// ==========================================
app.get("/api/expensive-by-id/:user_id", async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const result = await safeQuery(
      `SELECT id, amount, text, date
      FROM public.expensives
      WHERE id = $1`,
      [user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Error fetching expense." });
  }
});

// ==========================================
// GET QUOTATION BY ID
// ==========================================
app.get("/GetQuotationById/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await safeQuery(
      `SELECT * FROM quotation_v WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: "Quotation not found",
        id: id 
      });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching quotation:", error);
    res.status(500).json({ 
      message: "Error fetching quotation",
      error: error.message 
    });
  }
});

app.post("/api/AddExpensives", async (req, res) => {
  const { text, amount, date } = req.body;

  try {
    const result = await safeQuery(
      'INSERT INTO "expensives" (text, amount, date) VALUES ($1, $2, $3) RETURNING *',
      [text, amount, date]
    );

    await logSystemAction({
      actionType: 'create',
      entityType: 'expense',
      entityId: result.rows[0]?.id,
      actionDetails: { text, amount },
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Expense added successfully", expense: result.rows[0] });
  } catch (error) {
    console.error("Error creating expense:", error);
    await logSystemAction({
      actionType: 'create',
      entityType: 'expense',
      actionDetails: { text, amount },
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// GET EXPENSES
// ==========================================
app.get("/api/expensives", async (req, res) => {
  try {
    const result = await safeQuery('SELECT * FROM "expensives"');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// UPDATE EXPENSE
// ==========================================
app.put("/api/update-expensive/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { text, amount, date } = req.body;

  try {
    const oldDataResult = await safeQuery(
      "SELECT text, amount, date FROM public.expensives WHERE id = $1",
      [user_id]
    );

    if (oldDataResult.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found." });
    }

    const oldData = oldDataResult.rows[0];

    const formatDate = (d) => {
      if (!d) return "";
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    };

    await safeQuery(
      `UPDATE public.expensives
       SET text = $1, amount = $2, date = $3
       WHERE id = $4`,
      [text, amount, date, user_id]
    );

    const logs = [];

    if (oldData.text !== text) {
      logs.push({
        field_name: "text",
        old_value: oldData.text,
        new_value: text,
        comment: `Text changed from "${oldData.text}" to "${text}"`,
      });
    }

    if (parseFloat(oldData.amount) !== parseFloat(amount)) {
      logs.push({
        field_name: "amount",
        old_value: oldData.amount.toString(),
        new_value: amount.toString(),
        comment: `Amount changed from ${oldData.amount} to ${amount}`,
      });
    }

    const oldDateFormatted = formatDate(oldData.date);
    const newDateFormatted = formatDate(date);
    if (oldDateFormatted !== newDateFormatted) {
      logs.push({
        field_name: "date",
        old_value: oldDateFormatted,
        new_value: newDateFormatted,
        comment: `Date changed from ${oldDateFormatted} to ${newDateFormatted}`,
      });
    }

    for (const log of logs) {
      await safeQuery(
        `INSERT INTO expenses_logs (expense_id, field_name, old_value, new_value, comment)
         VALUES ($1, $2, $3, $4, $5)`,
        [user_id, log.field_name, log.old_value, log.new_value, log.comment]
      );
    }

    await logSystemAction({
      actionType: 'update',
      entityType: 'expense',
      entityId: parseInt(user_id),
      actionDetails: { 
        updatedFields: logs.map(l => l.field_name),
        changes: logs
      },
      oldData: oldData,
      newData: { text, amount, date },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Expense updated successfully and logged." });
  } catch (error) {
    console.error("Error updating expense:", error);
    await logSystemAction({
      actionType: 'update',
      entityType: 'expense',
      entityId: parseInt(user_id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error updating expense." });
  }
});

// ==========================================
// DELETE EXPENSE
// ==========================================
app.delete("/api/Delete_Expense/:id", async (req, res) => {
  const expenseId = parseInt(req.params.id);

  if (isNaN(expenseId)) {
    return res.status(400).json({ error: "Invalid expense ID" });
  }

  try {
    const expenseData = await safeQuery(
      `SELECT * FROM expensives WHERE id = $1`,
      [expenseId]
    );

    const query = "DELETE FROM expensives WHERE id = $1 RETURNING *";
    const result = await safeQuery(query, [expenseId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await logSystemAction({
      actionType: 'delete',
      entityType: 'expense',
      entityId: expenseId,
      oldData: expenseData.rows[0] || null,
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting the record:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'expense',
      entityId: expenseId,
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Failed to delete the record" });
  }
});

// ==========================================
// CREATE USER
// ==========================================
// Update the /CreateUser endpoint to return the user ID
app.post(
  "/CreateUser",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  async (req, res) => {
    const {
      username,
      nationality,
      dateOfBirth,
      address,
      phonenumber,
      email,
      countrycode,
      gender,
      isverified,
      instagram,
      facebook,
      snapchat,
      linkedin,
      tiktok,
      twitter,
      gmail,
      instagramPassword,
      facebookPassword,
      snapchatPassword,
      linkedinPassword,
      tiktokPassword,
      twitterPassword,
      gmailPassword,
      instagramEmail,
      facebookEmail,
      snapchatEmail,
      linkedinEmail,
      tiktokEmail,
      twitterEmail,
      gmailEmail,
    } = req.body;

    try {
      const result = await safeQuery(
        `INSERT INTO sm_users (username, nationality, date_of_birth, address, phonenumber, email, countrycode, gender, isverified) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          username,
          nationality,
          dateOfBirth,
          address,
          phonenumber,
          email,
          countrycode,
          gender,
          isverified,
        ]
      );

      const userId = result.rows[0].id;

      if (req.files.profileImage) {
        const profileImage = req.files.profileImage[0];
        await safeQuery(
          "UPDATE sm_users SET image = $1, image_content_type = $2 WHERE id = $3",
          [profileImage.buffer, profileImage.mimetype, userId]
        );
      }

      if (req.files.additionalImages) {
        const imagePromises = req.files.additionalImages.map((file) => {
          return safeQuery(
            "INSERT INTO images (user_id, image, image_type) VALUES ($1, $2, $3)",
            [userId, file.buffer, file.mimetype]
          );
        });
        await Promise.all(imagePromises);
      }

      await safeQuery(
        `INSERT INTO public.social_media_accounts (
          user_id, instagram, facebook, snapchat, linkedin, tiktok, 
          facebook_password, snapchat_password, linkedin_password, tiktok_password, 
          instagram_password, gmail, twitter, gmail_password, twitter_password, 
          instagram_email, facebook_email, snapchat_email, linkedin_email, tiktok_email, 
          gmail_email, twitter_email
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
        [
          userId,
          instagram,
          facebook,
          snapchat,
          linkedin,
          tiktok,
          facebookPassword || null,
          snapchatPassword || null,
          linkedinPassword || null,
          tiktokPassword || null,
          instagramPassword || null,
          gmail,
          twitter,
          gmailPassword || null,
          twitterPassword || null,
          instagramEmail || null,
          facebookEmail || null,
          snapchatEmail || null,
          linkedinEmail || null,
          tiktokEmail || null,
          gmailEmail || null,
          twitterEmail || null,
        ]
      );

      await logSystemAction({
        userId: userId,
        actionType: 'create',
        entityType: 'user',
        entityId: userId,
        actionDetails: { username, email },
        newData: { username, email, nationality },
        req,
        status: 'success',
      });

      // Return the user ID so credit cards can be associated
      res.status(200).json({ 
        message: "User added successfully!",
        id: userId,
        userId: userId,
        username: username
      });
    } catch (err) {
      console.error("Database query error:", err);
      await logSystemAction({
        actionType: 'create',
        entityType: 'user',
        actionDetails: { username },
        status: 'error',
        errorMessage: err.message,
        req,
      });
      res.status(500).json({ error: "Error creating user." });
    }
  }
);

// ==========================================
// CREATE EMPLOYEE
// ==========================================
app.post(
  "/CreateEmployee",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  async (req, res) => {
    const {
      username,
      nationality,
      dateOfBirth,
      address,
      phonenumber,
      email,
      countrycode,
      gender,
      isverified,
      job_description,
      salary,
    } = req.body;

    const isVerifiedBool = isverified === "true";

    try {
      const result = await safeQuery(
        `INSERT INTO employee (username, nationality, date_of_birth, address, phonenumber, email, countrycode, gender, isverified, job_description, salary) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [
          username,
          nationality,
          dateOfBirth,
          address,
          phonenumber,
          email,
          countrycode,
          gender,
          isVerifiedBool,
          job_description,
          salary ? parseFloat(salary) : 0,
        ]
      );

      const employeeId = result.rows[0].id;

      if (req.files.profileImage && req.files.profileImage.length > 0) {
        const profileImage = req.files.profileImage[0];
        await safeQuery(
          "UPDATE employee SET image = $1, image_content_type = $2 WHERE id = $3",
          [profileImage.buffer, profileImage.mimetype, employeeId]
        );
      }

      if (req.files.additionalImages) {
        const imagePromises = req.files.additionalImages.map((file) => {
          return safeQuery(
            "INSERT INTO images_employee (employee_id, image, image_type) VALUES ($1, $2, $3)",
            [employeeId, file.buffer, file.mimetype]
          );
        });
        await Promise.all(imagePromises);
      }

      await logSystemAction({
        userId: employeeId,
        actionType: 'create',
        entityType: 'employee',
        entityId: employeeId,
        actionDetails: { username, job_description },
        newData: { username, job_description, salary },
        req,
        status: 'success',
      });

      res.status(200).json({ message: "Employee added successfully!", id: employeeId });
    } catch (err) {
      console.error("Database query error:", err);
      await logSystemAction({
        actionType: 'create',
        entityType: 'employee',
        actionDetails: { username },
        status: 'error',
        errorMessage: err.message,
        req,
      });
      res.status(500).json({ error: "Error creating employee." });
    }
  }
);

// ==========================================
// GET EMPLOYEE VIEW
// ==========================================
app.get("/api/employee-view/:id", async (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT 
      u.id AS user_id,
      u.username,
      u.nationality,
      u.date_of_birth,
      u.gender,
      u.countrycode,
      u.address,
      u.phonenumber,
      u.email,
      u.image AS profile_image,
      u.image_content_type AS profile_image_content_type,
      u.isverified,
      u.job_description,
      u.salary,
      i.id AS image_id,
      i.image AS image_data,
      i.image_type AS image_type,
      (select count(*) from images_employee i where u.id = i.employee_id) as count
    FROM 
      employee u
    LEFT JOIN 
      images_employee i ON u.id = i.employee_id
    WHERE 
      u.id = $1;
  `;

  try {
    const result = await safeQuery(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).send("User not found.");
    }

    const user = result.rows[0];
    const images = result.rows
      .filter((row) => row.image_data)
      .map((row) => ({
        image_id: row.image_id,
        image: Buffer.from(row.image_data).toString("base64"),
        image_type: row.image_type,
      }));

    res.json({
      user: {
        id: user.user_id,
        username: user.username,
        nationality: user.nationality,
        date_of_birth: user.date_of_birth,
        address: user.address,
        gender: user.gender,
        isverified: user.isverified,
        phonenumber: user.phonenumber,
        countrycode: user.countrycode,
        job_description: user.job_description,
        salary: parseFloat(user.salary) || 0,
        email: user.email,
        profile_image: user.profile_image
          ? Buffer.from(user.profile_image).toString("base64")
          : null,
        profile_image_content_type: user.profile_image_content_type,
        count: user.count,
      },
      images,
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Error fetching user details.");
  }
});

// ==========================================
// USER VIEW
// ==========================================
const getSocialMediaData = async (userId) => {
  const query = `
  SELECT 
      sb.id as backup_code_id,
      sa.id as social_media_id,
      sa.instagram, sa.facebook, sa.snapchat, sa.linkedin, sa.tiktok, sa.gmail, sa.twitter, sa.hotmail,
      sa.instagram_password, sa.facebook_password, sa.snapchat_password, sa.linkedin_password, 
      sa.tiktok_password, sa.gmail_password, sa.twitter_password, 
      sa.hotmail_password,
      sa.instagram_backupcode, sa.facebook_backupcode, sa.snapchat_backupcode, sa.linkedin_backupcode, 
      sa.tiktok_backupcode, sa.gmail_backupcode, sa.twitter_backupcode, sa.hotmail_backupcode,
      sa.instagram_email, sa.facebook_email, sa.snapchat_email, sa.linkedin_email, 
      sa.tiktok_email, sa.gmail_email, sa.twitter_email, sa.hotmail_email,
      sb.platform, sb.backup_code
  FROM 
      public.social_media_accounts sa
  LEFT JOIN 
      public.social_media_backupcodes sb ON sa.id = sb.social_media_account_id
  WHERE 
      sa.user_id = $1
  ORDER BY sb.id ASC
  `;

  try {
    const res = await safeQuery(query, [userId]);
    return res.rows;
  } catch (error) {
    console.error("Error in getSocialMediaData:", error);
    return [];
  }
};

const formatPlatformData = (data, platform) => {
  if (!data || !Array.isArray(data)) {
    return { platformInfo: [] };
  }

  const platformData = data.filter(item => item[platform] !== null || item.platform === platform);

  const seen = new Set();

  const platformInfo = platformData
    .map(item => {
      const backupCodes = platformData
        .filter(data =>
          data.social_media_id === item.social_media_id &&
          data.platform === platform
        )
        .map(data => ({ 
          id: data.backup_code_id, 
          backup_code: data.backup_code 
        }))
        .filter(code => code.backup_code !== null && code.backup_code !== undefined);

      if (
        item[platform] ||
        item[`${platform}_password`] ||
        item[`${platform}_email`] ||
        item[`${platform}_backupcode`]
      ) {
        return {
          id: item.social_media_id || null,
          username: item[platform] || null,
          password: item[`${platform}_password`] || null,
          email: item[`${platform}_email`] || null,
          backupcode: item[`${platform}_backupcode`] || null,
          backupcodes: backupCodes && backupCodes.length > 0 ? backupCodes : []
        };
      }
      return null;
    })
    .filter(item => item !== null)
    .filter(item => {
      const key = `${item.username || ""}-${item.email || ""}-${item.id || ""}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

  return {
    platformInfo: platformInfo && platformInfo.length > 0 ? platformInfo : []
  };
};

app.get("/api/user-view/:id", async (req, res) => {
  const userId = req.params.id;

  const query = `
  SELECT DISTINCT
    u.id AS user_id,
    u.username,
    u.nationality,
    u.date_of_birth,
    u.gender,
    u.countrycode,
    u.address,
    u.phonenumber,
    u.business_name,
    u.email,
    u.image AS profile_image,
    u.image_content_type AS profile_image_content_type,
    u.isverified,
    u.created_at,
    i.id AS image_id,
    i.image AS image_data,
    i.image_type AS image_type,
    c.id AS card_id,
    c.card_holder_name,
    c.card_number,
    c.expiration_date,
    c.cvv,
    c.billing_address,
    c.card_type,
    (SELECT COUNT(*) FROM images i WHERE i.user_id = u.id) AS image_count,
    (SELECT COALESCE(SUM(a.amount), 0) FROM accounting_invoices a WHERE a.user_id = u.id) AS total_invoices
  FROM 
    sm_users u
  LEFT JOIN 
    images i ON u.id = i.user_id 
  LEFT JOIN 
    credit_cards c ON u.id = c.user_id
  WHERE 
    u.id = $1
  `;
  
  try {
    const result = await safeQuery(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
   
    const firstRow = result.rows[0];

    const uniqueImages = result.rows
      .filter((row) => row.image_data)
      .reduce((acc, row) => {
        const imageExists = acc.some((img) => img.image_id === row.image_id);
        if (!imageExists && row.image_id) {
          acc.push({
            image_id: row.image_id,
            image: Buffer.from(row.image_data).toString("base64"),
            image_type: row.image_type,
          });
        }
        return acc;
      }, []);

    const creditCards = result.rows
      .filter((row) => row.card_number)
      .reduce((acc, row) => {
        const cardExists = acc.some((card) => card.card_id === row.card_id);
        if (!cardExists && row.card_id) {
          try {
            acc.push({
              card_id: row.card_id,
              card_holder_name: row.card_holder_name || "",
              card_number: decrypt(row.card_number),
              expiration_date: row.expiration_date,
              cvv: decrypt(row.cvv),
              billing_address: row.billing_address || "",
              card_type: row.card_type || "",
            });
          } catch (decryptError) {
            console.error("Error decrypting card data:", decryptError);
            acc.push({
              card_id: row.card_id,
              card_holder_name: row.card_holder_name || "",
              card_number: "****",
              expiration_date: row.expiration_date,
              cvv: "***",
              billing_address: row.billing_address || "",
              card_type: row.card_type || "",
            });
          }
        }
        return acc;
      }, []);

    let socialMedia = [];
    try {
      const socialData = await getSocialMediaData(userId);
      socialMedia = [{
        instagram: formatPlatformData(socialData, 'instagram'),
        facebook: formatPlatformData(socialData, 'facebook'),
        snapchat: formatPlatformData(socialData, 'snapchat'),
        linkedin: formatPlatformData(socialData, 'linkedin'),
        tiktok: formatPlatformData(socialData, 'tiktok'),
        twitter: formatPlatformData(socialData, 'twitter'),
        gmail: formatPlatformData(socialData, 'gmail'),
        hotmail: formatPlatformData(socialData, 'hotmail')
      }];
    } catch (socialError) {
      console.error("Error fetching social media data:", socialError);
      socialMedia = [{}];
    }

    const response = {
      user: {
        id: firstRow.user_id,
        username: firstRow.username || "",
        nationality: firstRow.nationality || "",
        date_of_birth: firstRow.date_of_birth,
        business_name: firstRow.business_name || "",
        gender: firstRow.gender || "",
        address: firstRow.address || "",
        phonenumber: firstRow.phonenumber || "",
        countrycode: firstRow.countrycode || "",
        email: firstRow.email || "",
        isverified: firstRow.isverified || false,
        profile_image: firstRow.profile_image
          ? Buffer.from(firstRow.profile_image).toString("base64")
          : null,
        profile_image_content_type: firstRow.profile_image_content_type,
        total_invoices: firstRow.total_invoices || 0,
        image_count: firstRow.image_count || 0,
        created_at: firstRow.created_at,
        social_media: socialMedia,
      },
      images: uniqueImages,
      credit_cards: creditCards,
    };

    res.json(response);
  } catch (err) {
    console.error("Database query error:", err.message || err);
    res.status(500).json({ 
      message: "Error fetching user details.", 
      error: err.message || err 
    });
  }
});

// ==========================================
// DELETE EDIT HISTORY (RECOVERED ACCOUNTS)
// ==========================================
app.delete("/api/editHistory/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Delete password history from accounts_history
    await safeQuery(
      `DELETE FROM accounts_history WHERE user_id = $1`,
      [id]
    );

    // Delete username history
    await safeQuery(
      `DELETE FROM username_history WHERE user_id = $1`,
      [id]
    );

    // Also delete any recovered account specific history if exists
    await safeQuery(
      `DELETE FROM recovered_accounts_history WHERE recovered_account_id = $1`,
      [id]
    ).catch(() => {}); // Ignore if table doesn't exist

    res.status(200).json({ 
      message: "Edit history deleted successfully",
      deleted: true
    });
  } catch (error) {
    console.error("Error deleting edit history:", error);
    res.status(500).json({ 
      error: "Failed to delete edit history", 
      details: error.message 
    });
  }
});

// ==========================================
// TOP SCORERS
// ==========================================
app.get("/api/top-scorers", async (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.username,
      u.image AS profile_image,
      u.image_content_type,
      COALESCE(SUM(a.amount), 0) AS total_invoices
    FROM sm_users u
    LEFT JOIN accounting_invoices a ON u.id = a.user_id
    GROUP BY u.id
    ORDER BY total_invoices DESC
    LIMIT 3
  `;
  try {
    const result = await safeQuery(query);
    const users = result.rows.map(row => ({
      id: row.id,
      username: row.username,
      total_invoices: row.total_invoices,
      profile_image: row.profile_image
        ? `data:${row.image_content_type};base64,${row.profile_image.toString("base64")}`
        : null
    }));
    res.json(users);
  } catch (err) {
    console.error("Error fetching top scorers:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================
// USER COUNT
// ==========================================
app.get("/api/userscount", async (req, res) => {
  try {
    const result = await safeQuery(
      "SELECT COUNT(*) AS user_count FROM public.sm_users"
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// USERS BY NATIONALITY
// ==========================================
app.get('/api/users-by-nationality', async (req, res) => {
  try {
    const result = await safeQuery(`
      SELECT nationality, COUNT(username) AS count
      FROM sm_users
      GROUP BY nationality
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users by nationality' });
  }
});

// ==========================================
// GET RECOVERED ACCOUNTS
// ==========================================
app.get("/api/recoveredAccounts", async (req, res) => {
  try {
    const result = await safeQuery(
      "select s.id as sm_id, r.* from recovered_accounts r inner join sm_users s on s.username = r.username"
    );
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// ==========================================
// GET RECOVERED ACCOUNT PROFILE
// ==========================================
app.get("/api/recoveredAccountProfile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await safeQuery(
      "SELECT * FROM recovered_accounts WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

// ==========================================
// CREATE RECOVERED ACCOUNT
// ==========================================
app.post("/CreateRecoveredAccount", upload.none(), async (req, res) => {
  try {
    const {
      username,
      instagram,
      facebook,
      snapchat,
      linkedin,
      tiktok,
      facebook_password,
      snapchat_password,
      linkedin_password,
      tiktok_password,
      instagram_password,
      instagram_email,
      facebook_email,
      snapchat_email,
      linkedin_email,
      tiktok_email,
      email_personal,
      twitter,
      twitter_password,
      twitter_email,
      gmail,
      gmail_password,
      gmail_email,
      email,
      email_password,
    } = req.body;

    if (!username || !email_personal) {
      return res.status(400).json({ error: "Username and personal email are required." });
    }

    const query = `
    INSERT INTO public.recovered_accounts (
      username, instagram, facebook, snapchat, linkedin, tiktok,
      facebook_password, snapchat_password, linkedin_password, tiktok_password,
      instagram_password, instagram_email, facebook_email, snapchat_email,
      linkedin_email, tiktok_email, email, twitter, twitter_password,
      twitter_email, gmail_username, gmail_password, gmail_email,email_username,
      email_password
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, $25
    ) RETURNING *;
  `;

    const values = [
      username,
      instagram || null,
      facebook || null,
      snapchat || null,
      linkedin || null,
      tiktok || null,
      facebook_password || null,
      snapchat_password || null,
      linkedin_password || null,
      tiktok_password || null,
      instagram_password || null,
      instagram_email || null,
      facebook_email || null,
      snapchat_email || null,
      linkedin_email || null,
      tiktok_email || null,
      email_personal || null,
      twitter || null,
      twitter_password || null,
      twitter_email || null,
      gmail || null,
      gmail_password || null,
      gmail_email || null,
      email || null,
      email_password || null,
    ];

    const result = await safeQuery(query, values);

    await logSystemAction({
      username: username,
      actionType: 'create',
      entityType: 'recovered_account',
      actionDetails: { username, email: email_personal },
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.status(201).json({
      message: "Recovered account added successfully!",
      account: result.rows[0],
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    await logSystemAction({
      actionType: 'create',
      entityType: 'recovered_account',
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "An error occurred while inserting data." });
  }
});

// ==========================================
// DELETE RECOVERED ACCOUNT
// ==========================================
app.delete("/api/deleteRecoveredAccounts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const oldData = await safeQuery(
      `SELECT * FROM recovered_accounts WHERE id = $1`,
      [id]
    );

    const result = await safeQuery(
      `DELETE FROM recovered_accounts WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    await logSystemAction({
      actionType: 'delete',
      entityType: 'recovered_account',
      entityId: parseInt(id),
      oldData: oldData.rows[0] || null,
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting recovered account:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'recovered_account',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// GET EXPENSES FILTERED (Current Month)
// ==========================================
app.get("/api/getexpensesfiltered", async (req, res) => {
  const query = `SELECT * FROM "expensives"
  WHERE date >= date_trunc('month', CURRENT_DATE) 
      AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'`;

  try {
    const result = await safeQuery(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Error fetching expense records.");
  }
});

// ==========================================
// POST IMAGES
// ==========================================
app.post(
  "/api/post-images",
  upload.array("additionalImages"),
  async (req, res) => {
    const userId = req.body.userId;
    const images = req.files;

    try {
      if (!images || images.length === 0) {
        return res.status(400).json({ message: "No images uploaded." });
      }

      for (const image of images) {
        const imageBuffer = image.buffer;
        const imageType = image.mimetype;

        await safeQuery(
          "INSERT INTO images (user_id, image, image_type) VALUES ($1, $2, $3) RETURNING id",
          [userId, imageBuffer, imageType]
        );
      }

      await logSystemAction({
        userId: userId,
        actionType: 'create',
        entityType: 'image',
        actionDetails: { count: images.length },
        req,
        status: 'success',
      });

      res.status(200).json({ message: "Images uploaded successfully." });
    } catch (error) {
      console.error("Error uploading images:", error);
      await logSystemAction({
        userId: userId,
        actionType: 'create',
        entityType: 'image',
        status: 'error',
        errorMessage: error.message,
        req,
      });
      res.status(500).json({ message: "Internal server error.", error: error.message });
    }
  }
);

// ==========================================
// POST IMAGES EMPLOYEE
// ==========================================
app.post(
  "/api/post-images-employee",
  upload.array("additionalImages"),
  async (req, res) => {
    const userId = req.body.userId;
    const images = req.files;

    try {
      if (!images || images.length === 0) {
        return res.status(400).json({ message: "No images uploaded." });
      }

      for (const image of images) {
        const imageBuffer = image.buffer;
        const imageType = image.mimetype;

        await safeQuery(
          "INSERT INTO images_employee (employee_id, image, image_type) VALUES ($1, $2, $3) RETURNING id",
          [userId, imageBuffer, imageType]
        );
      }

      await logSystemAction({
        userId: userId,
        actionType: 'create',
        entityType: 'image_employee',
        actionDetails: { count: images.length },
        req,
        status: 'success',
      });

      res.status(200).json({ message: "Images uploaded successfully." });
    } catch (error) {
      console.error("Error uploading images:", error);
      await logSystemAction({
        userId: userId,
        actionType: 'create',
        entityType: 'image_employee',
        status: 'error',
        errorMessage: error.message,
        req,
      });
      res.status(500).json({ message: "Internal server error.", error: error.message });
    }
  }
);

// ==========================================
// DELETE IMAGE
// ==========================================
app.delete("/api/delete-image/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const oldData = await safeQuery(
      `SELECT * FROM images WHERE id = $1`,
      [id]
    );

    const result = await safeQuery("DELETE FROM images WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    await logSystemAction({
      actionType: 'delete',
      entityType: 'image',
      entityId: parseInt(id),
      oldData: oldData.rows[0] || null,
      req,
      status: 'success',
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'image',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error deleting image" });
  }
});

// ==========================================
// UPDATE PROFILE IMAGE
// ==========================================
app.put(
  "/api/update-profile-image",
  upload.single("profile_image"),
  async (req, res) => {
    const { user_id } = req.body;
    const profileImage = req.file;

    if (!user_id || !profileImage) {
      return res.status(400).json({ error: "User ID and image file are required" });
    }

    const imageBuffer = profileImage.buffer;
    const imageType = profileImage.mimetype;

    try {
      const oldData = await safeQuery(
        `SELECT image FROM sm_users WHERE id = $1`,
        [user_id]
      );

      const query = `UPDATE sm_users SET image = $1, image_content_type = $2 WHERE id = $3`;
      const result = await safeQuery(query, [imageBuffer, imageType, user_id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      await logSystemAction({
        userId: user_id,
        actionType: 'update',
        entityType: 'user',
        entityId: user_id,
        actionDetails: { field: 'profile_image' },
        oldData: oldData.rows[0] || null,
        req,
        status: 'success',
      });

      res.status(200).json({ message: "Profile image updated successfully" });
    } catch (error) {
      console.error("Error updating profile image:", error);
      await logSystemAction({
        userId: user_id,
        actionType: 'update',
        entityType: 'user',
        entityId: user_id,
        status: 'error',
        errorMessage: error.message,
        req,
      });
      res.status(500).json({ error: "Database update failed" });
    }
  }
);

// ==========================================
// UPDATE PROFILE IMAGE EMPLOYEE
// ==========================================
app.put(
  "/api/update-profile-image-employee",
  upload.single("profile_image"),
  async (req, res) => {
    const { user_id } = req.body;
    const profileImage = req.file;

    if (!user_id || !profileImage) {
      return res.status(400).json({ error: "User ID and image file are required" });
    }

    const imageBuffer = profileImage.buffer;
    const imageType = profileImage.mimetype;

    try {
      const query = `UPDATE employee SET image = $1, image_content_type = $2 WHERE id = $3`;
      const result = await safeQuery(query, [imageBuffer, imageType, user_id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }

      await logSystemAction({
        userId: user_id,
        actionType: 'update',
        entityType: 'employee',
        entityId: user_id,
        actionDetails: { field: 'profile_image' },
        req,
        status: 'success',
      });

      res.status(200).json({ message: "Profile image updated successfully" });
    } catch (error) {
      console.error("Error updating profile image:", error);
      await logSystemAction({
        userId: user_id,
        actionType: 'update',
        entityType: 'employee',
        entityId: user_id,
        status: 'error',
        errorMessage: error.message,
        req,
      });
      res.status(500).json({ error: "Database update failed" });
    }
  }
);

// ==========================================
// PUT IMAGES
// ==========================================
app.put("/api/put-images/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, image, image_type } = req.body;

  const imageBuffer = Buffer.from(image, "base64");

  try {
    const oldData = await safeQuery(
      `SELECT * FROM images WHERE id = $1`,
      [id]
    );

    const query = `
      UPDATE images
      SET user_id = $1, image = COALESCE($2, image), image_type = $3
      WHERE id = $4
      RETURNING *`;

    const result = await safeQuery(query, [user_id, imageBuffer, image_type, id]);

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'image',
      entityId: parseInt(id),
      oldData: oldData.rows[0] || null,
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'image',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error updating image" });
  }
});

// ==========================================
// PUT IMAGES EMPLOYEE
// ==========================================
app.put("/api/put-images-employee/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, image, image_type } = req.body;

  const imageBuffer = Buffer.from(image, "base64");

  try {
    const query = `
      UPDATE images_employee
      SET employee_id = $1, image = COALESCE($2, image), image_type = $3
      WHERE id = $4
      RETURNING *`;

    const result = await safeQuery(query, [user_id, imageBuffer, image_type, id]);

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'image_employee',
      entityId: parseInt(id),
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'image_employee',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Error updating image" });
  }
});

// ==========================================
// CREDIT CARDS ROUTES
// ==========================================
app.post("/post-credit-cards", async (req, res) => {
  try {
    const {
      card_holder_name,
      card_number,
      expiration_date,
      cvv,
      billing_address,
      user_id,
      card_type,
    } = req.body;

    if (!card_number || !cvv || !expiration_date || !user_id) {
      return res.status(400).json({
        error: "Card number, CVV, expiration date, and user ID are required.",
      });
    }

    const encryptedCardNumber = encrypt(card_number);
    const encryptedCVV = encrypt(cvv);

    const result = await safeQuery(
      "INSERT INTO credit_cards (card_holder_name, card_number, expiration_date, cvv, billing_address, user_id, card_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        card_holder_name,
        encryptedCardNumber,
        expiration_date,
        encryptedCVV,
        billing_address,
        user_id,
        card_type,
      ]
    );

    await logSystemAction({
      userId: user_id,
      actionType: 'create',
      entityType: 'credit_card',
      entityId: result.rows[0]?.id,
      actionDetails: { card_holder_name, card_type },
      newData: { card_holder_name, card_type },
      req,
      status: 'success',
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating credit card:", error);
    await logSystemAction({
      actionType: 'create',
      entityType: 'credit_card',
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

app.get("/get-credit-cards", async (req, res) => {
  try {
    const result = await safeQuery("SELECT * FROM credit_cards");
    const decryptedCards = result.rows.map((card) => ({
      ...card,
      card_number: decrypt(card.card_number),
      cvv: decrypt(card.cvv),
    }));
    res.json(decryptedCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getid-credit-cards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await safeQuery("SELECT * FROM credit_cards WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Credit Card not found" });
    }
    const card = result.rows[0];
    card.card_number = decrypt(card.card_number);
    card.cvv = decrypt(card.cvv);
    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/put-credit-cards/:id", async (req, res) => {
  const { id } = req.params;
  const {
    card_holder_name,
    card_number,
    expiration_date,
    cvv,
    card_type,
    billing_address,
    user_id,
  } = req.body;

  if (!card_holder_name || !card_number || !expiration_date || !cvv || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const encryptedCardNumber = encrypt(card_number);
  const encryptedCVV = encrypt(cvv);

  try {
    const oldData = await safeQuery(
      `SELECT * FROM credit_cards WHERE id = $1`,
      [id]
    );

    const result = await safeQuery(
      "UPDATE credit_cards SET card_holder_name = $1, card_number = $2, expiration_date = $3, cvv = $4, billing_address = $5, user_id = $6, card_type = $7 WHERE id = $8 RETURNING *",
      [
        card_holder_name,
        encryptedCardNumber,
        expiration_date,
        encryptedCVV,
        billing_address,
        user_id,
        card_type,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Credit Card not found" });
    }

    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'credit_card',
      entityId: parseInt(id),
      actionDetails: { updatedFields: ['card_holder_name', 'card_type'] },
      oldData: oldData.rows[0] || null,
      newData: result.rows[0],
      req,
      status: 'success',
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating credit card:", error);
    await logSystemAction({
      userId: user_id,
      actionType: 'update',
      entityType: 'credit_card',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete-credit-cards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const oldData = await safeQuery(
      `SELECT * FROM credit_cards WHERE id = $1`,
      [id]
    );

    const result = await safeQuery(
      "DELETE FROM credit_cards WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Credit Card not found" });
    }
    
    await logSystemAction({
      actionType: 'delete',
      entityType: 'credit_card',
      entityId: parseInt(id),
      oldData: oldData.rows[0] || null,
      req,
      status: 'success',
    });
    
    res.json({ message: "Credit Card deleted successfully" });
  } catch (error) {
    console.error(error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'credit_card',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// JOB DESCRIPTIONS ROUTES
// ==========================================
app.get("/getjobs", async (req, res) => {
  try {
    const result = await safeQuery("SELECT * FROM job_descriptions");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching jobs:", error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/postjob", async (req, res) => {
  const { job_description } = req.body;
  try {
    await safeQuery(
      "INSERT INTO job_descriptions (job_description) VALUES ($1)",
      [job_description]
    );
    await logSystemAction({
      actionType: 'create',
      entityType: 'job',
      actionDetails: { job_description },
      req,
      status: 'success',
    });
    res.status(201).json({ message: "Job added successfully!" });
  } catch (error) {
    console.error("Error adding job:", error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deletejob/:id", async (req, res) => {
  const jobId = req.params.id;
  try {
    const oldData = await safeQuery(
      `SELECT * FROM job_descriptions WHERE id = $1`,
      [jobId]
    );

    await safeQuery("DELETE FROM public.job_descriptions WHERE id = $1", [jobId]);
    
    await logSystemAction({
      actionType: 'delete',
      entityType: 'job',
      entityId: parseInt(jobId),
      oldData: oldData.rows[0] || null,
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/updatejob/:id", async (req, res) => {
  const jobId = req.params.id;
  const { job_description } = req.body;
  try {
    const oldData = await safeQuery(
      `SELECT job_description FROM job_descriptions WHERE id = $1`,
      [jobId]
    );

    await safeQuery(
      "UPDATE public.job_descriptions SET job_description = $1 WHERE id = $2",
      [job_description, jobId]
    );

    await logSystemAction({
      actionType: 'update',
      entityType: 'job',
      entityId: parseInt(jobId),
      actionDetails: { field: 'job_description' },
      oldData: oldData.rows[0] || null,
      newData: { job_description },
      req,
      status: 'success',
    });

    res.status(200).json({ message: "Job updated successfully!" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// ==========================================
// FIX: ADD MISSING DELETE ENDPOINTS FOR CLIENT MANAGEMENT
// ==========================================

// ==========================================
// DELETE USER - COMPLETE
// ==========================================
app.delete("/api/delete-user-completely/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // First, check if user exists
    const userCheck = await safeQuery(
      'SELECT * FROM sm_users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Begin transaction
    await safeQuery('BEGIN');

    try {
      // Delete from social_media_backupcodes (through social_media_accounts)
      await safeQuery(
        `DELETE FROM social_media_backupcodes 
         WHERE social_media_account_id IN (
           SELECT id FROM social_media_accounts WHERE user_id = $1
         )`,
        [id]
      );

      // Delete from social_media_accounts
      await safeQuery(
        'DELETE FROM social_media_accounts WHERE user_id = $1',
        [id]
      );

      // Delete from images
      await safeQuery(
        'DELETE FROM images WHERE user_id = $1',
        [id]
      );

      // Delete from accounting_invoices
      await safeQuery(
        'DELETE FROM accounting_invoices WHERE user_id = $1',
        [id]
      );

      // Delete from username_history
      await safeQuery(
        'DELETE FROM username_history WHERE user_id = $1',
        [id]
      );

      // Delete from email_history
      await safeQuery(
        'DELETE FROM email_history WHERE user_id = $1',
        [id]
      );

      // Delete from accounts_history
      await safeQuery(
        'DELETE FROM accounts_history WHERE user_id = $1',
        [id]
      );

      // Delete from credit_cards
      await safeQuery(
        'DELETE FROM credit_cards WHERE user_id = $1',
        [id]
      );

      // Finally, delete the user
      const result = await safeQuery(
        'DELETE FROM sm_users WHERE id = $1 RETURNING *',
        [id]
      );

      await safeQuery('COMMIT');

      await logSystemAction({
        actionType: 'delete',
        entityType: 'user',
        entityId: parseInt(id),
        oldData: userCheck.rows[0],
        req,
        status: 'success',
      });

      res.status(200).json({ 
        message: "User and all associated data deleted successfully",
        deletedUser: result.rows[0]
      });

    } catch (error) {
      await safeQuery('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Error deleting user completely:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'user',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ 
      message: "Error deleting user", 
      error: error.message 
    });
  }
});

// ==========================================
// DELETE USER - Alternative endpoint
// ==========================================
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userCheck = await safeQuery(
      'SELECT * FROM sm_users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await safeQuery(
      'DELETE FROM sm_users WHERE id = $1 RETURNING *',
      [id]
    );

    await logSystemAction({
      actionType: 'delete',
      entityType: 'user',
      entityId: parseInt(id),
      oldData: userCheck.rows[0],
      req,
      status: 'success',
    });

    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUser: result.rows[0]
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'user',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ 
      message: "Error deleting user", 
      error: error.message 
    });
  }
});

// ==========================================
// DELETE USER - Alternative endpoint (delete-user)
// ==========================================
app.delete("/api/delete-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userCheck = await safeQuery(
      'SELECT * FROM sm_users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Begin transaction
    await safeQuery('BEGIN');

    try {
      // Delete associated records
      await safeQuery(
        `DELETE FROM social_media_backupcodes 
         WHERE social_media_account_id IN (
           SELECT id FROM social_media_accounts WHERE user_id = $1
         )`,
        [id]
      );

      await safeQuery(
        'DELETE FROM social_media_accounts WHERE user_id = $1',
        [id]
      );

      await safeQuery(
        'DELETE FROM images WHERE user_id = $1',
        [id]
      );

      await safeQuery(
        'DELETE FROM accounting_invoices WHERE user_id = $1',
        [id]
      );

      await safeQuery(
        'DELETE FROM credit_cards WHERE user_id = $1',
        [id]
      );

      const result = await safeQuery(
        'DELETE FROM sm_users WHERE id = $1 RETURNING *',
        [id]
      );

      await safeQuery('COMMIT');

      await logSystemAction({
        actionType: 'delete',
        entityType: 'user',
        entityId: parseInt(id),
        oldData: userCheck.rows[0],
        req,
        status: 'success',
      });

      res.status(200).json({ 
        message: "User and associated data deleted successfully",
        deletedUser: result.rows[0]
      });

    } catch (error) {
      await safeQuery('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Error deleting user:", error);
    await logSystemAction({
      actionType: 'delete',
      entityType: 'user',
      entityId: parseInt(id),
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ 
      message: "Error deleting user", 
      error: error.message 
    });
  }
});

// ==========================================
// BATCH DELETE USERS
// ==========================================
app.post("/api/users/batch-delete", async (req, res) => {
  const { userIds } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "Invalid user IDs provided" });
  }

  try {
    let deletedCount = 0;

    for (const id of userIds) {
      try {
        // Check if user exists
        const userCheck = await safeQuery(
          'SELECT * FROM sm_users WHERE id = $1',
          [id]
        );

        if (userCheck.rows.length > 0) {
          // Begin transaction for each user
          await safeQuery('BEGIN');

          try {
            // Delete associated records
            await safeQuery(
              `DELETE FROM social_media_backupcodes 
               WHERE social_media_account_id IN (
                 SELECT id FROM social_media_accounts WHERE user_id = $1
               )`,
              [id]
            );

            await safeQuery(
              'DELETE FROM social_media_accounts WHERE user_id = $1',
              [id]
            );

            await safeQuery(
              'DELETE FROM images WHERE user_id = $1',
              [id]
            );

            await safeQuery(
              'DELETE FROM accounting_invoices WHERE user_id = $1',
              [id]
            );

            await safeQuery(
              'DELETE FROM credit_cards WHERE user_id = $1',
              [id]
            );

            await safeQuery(
              'DELETE FROM sm_users WHERE id = $1',
              [id]
            );

            await safeQuery('COMMIT');
            deletedCount++;
          } catch (error) {
            await safeQuery('ROLLBACK');
            console.error(`Error deleting user ${id}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error processing user ${id}:`, error);
      }
    }

    await logSystemAction({
      actionType: 'batch_delete',
      entityType: 'user',
      actionDetails: { 
        totalRequested: userIds.length, 
        deletedCount: deletedCount 
      },
      req,
      status: 'success',
    });

    res.status(200).json({
      message: `Batch delete completed. Deleted ${deletedCount} out of ${userIds.length} users.`,
      deletedCount: deletedCount,
      totalRequested: userIds.length
    });

  } catch (error) {
    console.error("Error in batch delete:", error);
    await logSystemAction({
      actionType: 'batch_delete',
      entityType: 'user',
      status: 'error',
      errorMessage: error.message,
      req,
    });
    res.status(500).json({ 
      message: "Error in batch delete", 
      error: error.message 
    });
  }
});

// ==========================================
// GET USER ACCOUNTING
// ==========================================
app.get("/api/user-accounting/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await safeQuery(
      `SELECT EXISTS (
        SELECT 1 FROM accounting_invoices WHERE user_id = $1
      ) as has_records`,
      [id]
    );

    res.status(200).json({
      hasRecords: result.rows[0]?.has_records || false
    });
  } catch (error) {
    console.error("Error checking user accounting:", error);
    res.status(500).json({ 
      message: "Error checking user accounting", 
      error: error.message 
    });
  }
});

// ==========================================
// START SERVER
// ==========================================
app.listen(port, () => {
  console.log(`Social Media app is listening at http://localhost:${port}`);
});