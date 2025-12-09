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

// GET /products - list all perfumes
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /products - create new perfume
app.post("/products", async (req, res) => {
  try {
    const { name, description, collection, scent_family, size_ml, price_thb, image_url } = req.body;

    if (!name || !price_thb) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO product (name, description, collection, scent_family, size_ml, price_thb, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, collection, scent_family, size_ml, price_thb, image_url]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      collection,
      scent_family,
      size_ml,
      price_thb,
      image_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /products/:id - update perfume
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, collection, scent_family, size_ml, price_thb, image_url } = req.body;

    await pool.query(
      `UPDATE product SET name=?, description=?, collection=?, scent_family=?, size_ml=?, price_thb=?, image_url=? WHERE id=?`,
      [name, description, collection, scent_family, size_ml, price_thb, image_url, id]
    );

    res.json({ id: Number(id), name, description, collection, scent_family, size_ml, price_thb, image_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /products/:id - remove perfume
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM product WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
app.listen(port, () => {
  console.log(`MITH Perfume API listening on http://localhost:${port}`);
});
