"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the new product form
  const [formData, setFormData] = useState({
    name: "",
    collection: "",
    scent_family: "",
    size_ml: "",
    price_thb: "",
    description: "",
    image_url: ""
  });

  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiHost}/products`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setRows(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit (The "Create" Action)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiHost}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create product");
      
      const newProduct = await res.json();
      
      // Update UI immediately
      setRows((prev) => [...prev, newProduct]);
      
      // Clear form
      setFormData({
        name: "", collection: "", scent_family: "", size_ml: "", price_thb: "", description: "", image_url: ""
      });
      alert("Product added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="empty">Loading MITH perfumes…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">MITH Perfume Collection (Thailand)</h1>
      </header>

      {/* NEW: Create Product Form */}
      <section style={{ marginBottom: "2rem", padding: "1.5rem", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
        <h2 style={{ marginBottom: "1rem" }}>Add New Perfume</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "600px" }}>
          <input required name="name" placeholder="Name (e.g. Silver Sparkle)" value={formData.name} onChange={handleChange} style={{ padding: "8px" }} />
          <input required name="collection" placeholder="Collection (e.g. Signature)" value={formData.collection} onChange={handleChange} style={{ padding: "8px" }} />
          <input required name="scent_family" placeholder="Scent Family (e.g. Fresh)" value={formData.scent_family} onChange={handleChange} style={{ padding: "8px" }} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input required type="number" name="size_ml" placeholder="Size (ml)" value={formData.size_ml} onChange={handleChange} style={{ padding: "8px" }} />
            <input required type="number" name="price_thb" placeholder="Price (THB)" value={formData.price_thb} onChange={handleChange} style={{ padding: "8px" }} />
          </div>
          
          <textarea required name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={3} style={{ padding: "8px" }} />
          <input name="image_url" placeholder="Image URL (Optional)" value={formData.image_url} onChange={handleChange} style={{ padding: "8px" }} />
          
          <button type="submit" style={{ padding: "12px", background: "#000", color: "#fff", border: "none", cursor: "pointer", borderRadius: "4px" }}>
            Add Product
          </button>
        </form>
      </section>

      {/* Existing Product List */}
      {rows.length === 0 ? (
        <div className="empty">No perfumes found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {rows.map((p) => (
            <article key={p.id} className="card" tabIndex={0}>
              {p.image_url && (
                <div className="media">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="body">
                <h2 className="card-title">{p.name}</h2>
                <p className="detail">{p.description}</p>
                <div className="meta">
                  <small>
                    Collection: <span className="code">{p.collection}</span> ·
                    Scent: <span className="code">{p.scent_family}</span>
                  </small>
                  <br />
                  <small>
                    Size: <span className="code">{p.size_ml} ml</span> · Price:{" "}
                    <span className="code">
                      {Number(p.price_thb).toLocaleString()} THB
                    </span>
                  </small>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}