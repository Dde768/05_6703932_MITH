const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load .env.local for local development (ignored in Docker if not present)
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

// Simple root endpoint (optional, just for quick check)
app.get("/", (req, res) => {
  res.json({ message: "MITH Perfume API is running" });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok === 1 });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

//
// =============== PRODUCTS CRUD ===============
//

// GET /products - list all perfumes
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /products/:id - get single perfume by id
app.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const [rows] = await pool.query("SELECT * FROM product WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET /products/:id error:", err);
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

    // basic validation
    if (!name || !collection || !scent_family || !size_ml || !price_thb) {
      return res.status(400).json({
        error:
          "Missing required fields: name, collection, scent_family, size_ml, price_thb",
      });
    }

    const sizeValue = Number(size_ml);
    const priceValue = Number(price_thb);

    if (Number.isNaN(sizeValue) || Number.isNaN(priceValue)) {
      return res
        .status(400)
        .json({ error: "size_ml and price_thb must be numbers" });
    }

    const [result] = await pool.execute(
      `INSERT INTO product 
       (name, collection, scent_family, size_ml, price_thb, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        collection,
        scent_family,
        sizeValue,
        priceValue,
        description || "",
        image_url || "",
      ]
    );

    const newProduct = {
      id: result.insertId,
      name,
      collection,
      scent_family,
      size_ml: sizeValue,
      price_thb: priceValue,
      description: description || "",
      image_url: image_url || "",
    };

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /products/:id - update existing perfume
app.put("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const {
      name,
      collection,
      scent_family,
      size_ml,
      price_thb,
      description,
      image_url,
    } = req.body;

    if (!name || !collection || !scent_family || !size_ml || !price_thb) {
      return res.status(400).json({
        error:
          "Missing required fields: name, collection, scent_family, size_ml, price_thb",
      });
    }

    const sizeValue = Number(size_ml);
    const priceValue = Number(price_thb);

    if (Number.isNaN(sizeValue) || Number.isNaN(priceValue)) {
      return res
        .status(400)
        .json({ error: "size_ml and price_thb must be numbers" });
    }

    const [result] = await pool.execute(
      `UPDATE product
       SET name = ?, collection = ?, scent_family = ?, size_ml = ?, 
           price_thb = ?, description = ?, image_url = ?
       WHERE id = ?`,
      [
        name,
        collection,
        scent_family,
        sizeValue,
        priceValue,
        description || "",
        image_url || "",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      id,
      name,
      collection,
      scent_family,
      size_ml: sizeValue,
      price_thb: priceValue,
      description: description || "",
      image_url: image_url || "",
    });
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /products/:id - delete perfume
app.delete("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const [result] = await pool.execute(
      "DELETE FROM product WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted", id });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//
// =============== START SERVER ===============
//

const port = Number(process.env.PORT || process.env.API_PORT || 3001);
app.listen(port, () => {
  console.log(`MITH Perfume API listening on http://localhost:${port}`);
});
