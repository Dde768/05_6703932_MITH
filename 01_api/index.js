const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load .env.local for local development (ignored in Docker)
dotenv.config({ path: path.join(__dirname, ".env.local") });

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "MITH_Final_Project",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok === 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET /products - list all MITH perfumes
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /products - Create a new MITH perfume (ADDED)
app.post("/products", async (req, res) => {
  const { 
    name, 
    collection, 
    scent_family, 
    size_ml, 
    price_thb, 
    description, 
    image_url 
  } = req.body;

  try {
    const query = `
      INSERT INTO product 
      (name, collection, scent_family, size_ml, price_thb, description, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      name, 
      collection, 
      scent_family, 
      size_ml, 
      price_thb, 
      description, 
      image_url || "" // Default to empty string if no URL provided
    ]);

    // Return the created object so the frontend can update immediately
    res.status(201).json({ 
      id: result.insertId, 
      name, collection, scent_family, size_ml, price_thb, description, image_url 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product. Check server logs." });
  }
});

// Start server
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
app.listen(port, () => {
  console.log(`MITH Perfume API listening on http://localhost:${port}`);
});