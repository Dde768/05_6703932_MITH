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

// GET /products - list all perfumes
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product");
    res.json(rows);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /products - create new perfume
app.post("/products", async (req, res) => {
  try {
    const {
      name,
      collection,
      scent_family,
      size_ml,
      price_thb,
      description,
      image_url,
    } = req.body;

    if (
      !name ||
      !collection ||
      !scent_family ||
      size_ml == null ||
      price_thb == null
    ) {
      return res.status(400).json({
        error:
          "name, collection, scent_family, size_ml and price_thb are required.",
      });
    }

    const size = Number(size_ml);
    const price = Number(price_thb);
    if (Number.isNaN(size) || Number.isNaN(price)) {
      return res
        .status(400)
        .json({ error: "size_ml and price_thb must be numeric." });
    }

    const [result] = await pool.query(
      `INSERT INTO product
       (name, collection, scent_family, size_ml, price_thb, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, collection, scent_family, size, price, description ?? "", image_url ?? ""]
    );

    const [rows] = await pool.query(
      "SELECT * FROM product WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /products/:id - update perfume
app.put("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id." });

    const {
      name,
      collection,
      scent_family,
      size_ml,
      price_thb,
      description,
      image_url,
    } = req.body;

    if (
      !name ||
      !collection ||
      !scent_family ||
      size_ml == null ||
      price_thb == null
    ) {
      return res.status(400).json({
        error:
          "name, collection, scent_family, size_ml and price_thb are required.",
      });
    }

    const size = Number(size_ml);
    const price = Number(price_thb);
    if (Number.isNaN(size) || Number.isNaN(price)) {
      return res
        .status(400)
        .json({ error: "size_ml and price_thb must be numeric." });
    }

    const [result] = await pool.query(
      `UPDATE product
       SET name = ?, collection = ?, scent_family = ?, size_ml = ?, price_thb = ?,
           description = ?, image_url = ?
       WHERE id = ?`,
      [name, collection, scent_family, size, price, description ?? "", image_url ?? "", id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Perfume not found." });
    }

    const [rows] = await pool.query("SELECT * FROM product WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /products/:id - delete perfume
app.delete("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id." });

    const [result] = await pool.query("DELETE FROM product WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Perfume not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
app.listen(port, () => {
  console.log(`MITH Perfume API listening on http://localhost:${port}`);
});
