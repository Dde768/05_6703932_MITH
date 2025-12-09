"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    collection: "",
    scent_family: "",
    size_ml: "",
    price_thb: "",
    image_url: ""
  });

  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiHost}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const newProduct = await res.json();
      setRows([...rows, newProduct]);
      setForm({ name: "", description: "", collection: "", scent_family: "", size_ml: "", price_thb: "", image_url: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">MITH Perfume Collection (Thailand)</h1>
      </header>

      {/* Create Form */}
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Collection" value={form.collection} onChange={e => setForm({ ...form, collection: e.target.value })} />
        <input placeholder="Scent Family" value={form.scent_family} onChange={e => setForm({ ...form, scent_family: e.target.value })} />
        <input placeholder="Size (ml)" type="number" value={form.size_ml} onChange={e => setForm({ ...form, size_ml: e.target.value })} />
        <input placeholder="Price (THB)" type="number" value={form.price_thb} onChange={e => setForm({ ...form, price_thb: e.target.value })} required />
        <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
        <button type="submit">Add Perfume</button>
      </form>

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
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
