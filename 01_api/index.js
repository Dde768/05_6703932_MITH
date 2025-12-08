import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "mysql",
  user: "mith_user",
  password: "mith_pass",
  database: "mith_db",
});

app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/health", (req, res) => res.send("API running"));

app.listen(3001, () => console.log("✅ API running on port 3001"));
