const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load .env.local for local development
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

// Health check
app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok === 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// READ: Get all products
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE: Add a new product
app.post("/products", async (req, res) => {
  try {
    const { name, collection, scent_family, size_ml, price_thb, description, image_url } = req.body;
    const sql = `INSERT INTO product (name, collection, scent_family, size_ml, price_thb, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [name, collection, scent_family, size_ml, price_thb, description, image_url]);
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// UPDATE: Edit an existing product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, collection, scent_family, size_ml, price_thb, description, image_url } = req.body;
    const sql = `UPDATE product SET name=?, collection=?, scent_family=?, size_ml=?, price_thb=?, description=?, image_url=? WHERE id=?`;
    await pool.query(sql, [name, collection, scent_family, size_ml, price_thb, description, image_url, id]);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE: Remove a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM product WHERE id=?", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start server
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
app.listen(port, () => {
  console.log(`MITH Perfume API listening on http://localhost:${port}`);
});