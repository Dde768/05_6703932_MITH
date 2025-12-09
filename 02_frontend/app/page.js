"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    collection: "",
    scent_family: "",
    size_ml: "",
    price_thb: "",
    image_url: ""
  });

  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

  // Load perfumes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiHost}/products`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setRows(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${apiHost}/products/${form.id}` : `${apiHost}/products`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const product = await res.json();

      if (form.id) {
        // Update existing
        setRows(rows.map((p) => (p.id === product.id ? product : p)));
      } else {
        // Add new
        setRows([...rows, product]);
      }

      // Reset form
      setForm({
        id: null,
        name: "",
        description: "",
        collection: "",
        scent_family: "",
        size_ml: "",
        price_thb: "",
        image_url: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this perfume?")) return;
    try {
      const res = await fetch(`${apiHost}/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setRows(rows.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit
  const handleEdit = (p) => {
    setForm({ ...p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">MITH Perfume Collection (Thailand)</h1>
      </header>

      {/* Add/Edit Form */}
      <section className="form-card">
        <h2>{form.id ? "Edit Perfume" : "Add New Perfume"}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Collection" value={form.collection} onChange={e => setForm({ ...form, collection: e.target.value })} />
          <input placeholder="Scent Family" value={form.scent_family} onChange={e => setForm({ ...form, scent_family: e.target.value })} />
          <input placeholder="Size (ml)" type="number" value={form.size_ml} onChange={e => setForm({ ...form, size_ml: e.target.value })} />
          <input placeholder="Price (THB)" type="number" value={form.price_thb} onChange={e => setForm({ ...form, price_thb: e.target.value })} required />
          <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          <div className="form-actions">
            <button type="submit" className="btn-primary">{form.id ? "Update" : "Add Perfume"}</button>
            {form.id && (
              <button type="button" className="btn-secondary" onClick={() => setForm({ id: null, name: "", description: "", collection: "", scent_family: "", size_ml: "", price_thb: "", image_url: "" })}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Perfume Grid */}
      {loading ? (
        <div className="empty">Loading MITH perfumes…</div>
      ) : error ? (
        <div className="empty">Error: {error}</div>
      ) : rows.length === 0 ? (
        <div className="empty">No perfumes found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {rows.map((p) => (
            <article key={p.id} className="card" tabIndex={0}>
              {p.image_url && (
                <div className="media">
                  <img src={p.image_url} alt={p.name} className="img" loading="lazy" decoding="async" />
                </div>
              )}
              <div className="body">
                <h2 className="card-title">{p.name}</h2>
                <p className="detail">{p.description}</p>
                <div className="meta">
                  <small>
                    Collection: <span className="code">{p.collection}</span> · Scent: <span className="code">{p.scent_family}</span>
                  </small>
                  <br />
                  <small>
                    Size: <span className="code">{p.size_ml} ml</span> · Price: <span className="code">{Number(p.price_thb).toLocaleString()} THB</span>
                  </small>
                </div>
                <div className="actions">
                  <button className="btn-secondary" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
