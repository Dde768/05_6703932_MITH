"use client";

import { useEffect, useState } from "react";

// Decide which API base URL to use in the browser
function getApiBase() {
  if (typeof window !== "undefined") {
    // Same host as the frontend (e.g. 192.168.56.1) but port 3001
    return `http://${window.location.hostname}:3001`;
  }
  // Fallback (SSR/build – not really used in your case)
  return process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
}

const emptyForm = {
  name: "",
  collection: "",
  scent_family: "",
  size_ml: "",
  price_thb: "",
  description: "",
  image_url: "",
};

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiHost = getApiBase();
        const res = await fetch(`${apiHost}/products`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setRows(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form helpers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const size = Number(form.size_ml);
    const price = Number(form.price_thb);

    if (!form.name || !form.collection || !form.scent_family) {
      setError("Name, Collection and Scent Family are required.");
      setSaving(false);
      return;
    }
    if (Number.isNaN(size) || Number.isNaN(price)) {
      setError("Size (ml) and Price (THB) must be numeric.");
      setSaving(false);
      return;
    }

    try {
      const apiHost = getApiBase();
      const url = editingId
        ? `${apiHost}/products/${editingId}`
        : `${apiHost}/products`;
      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...form,
        size_ml: size,
        price_thb: price,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }

      if (editingId) {
        setRows((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      } else {
        setRows((prev) => [...prev, data]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (perfume) => {
    setEditingId(perfume.id);
    setForm({
      name: perfume.name || "",
      collection: perfume.collection || "",
      scent_family: perfume.scent_family || "",
      size_ml: perfume.size_ml?.toString() || "",
      price_thb: perfume.price_thb?.toString() || "",
      description: perfume.description || "",
      image_url: perfume.image_url || "",
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (typeof window !== "undefined") {
      if (!window.confirm("Delete this perfume?")) return;
    }
    setError("");

    try {
      const apiHost = getApiBase();
      const res = await fetch(`${apiHost}/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }

      setRows((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="empty">Loading MITH perfumes…</div>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">MITH Perfume Collection (Thailand)</h1>
      </header>

      {/* Create / Edit Form */}
      <section className="form-wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form-title">
            {editingId ? "Edit Perfume" : "Add New Perfume"}
          </h2>
          <p className="form-subtitle">
            Fill in the fragrance details and save to the collection.
          </p>

          <div className="form-grid">
            <div className="form-field">
              <label className="label">Name</label>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Heritage Oud"
                required
              />
            </div>

            <div className="form-field">
              <label className="label">Collection</label>
              <input
                className="input"
                name="collection"
                value={form.collection}
                onChange={handleChange}
                placeholder="Signature / Heritage"
                required
              />
            </div>

            <div className="form-field">
              <label className="label">Scent Family</label>
              <input
                className="input"
                name="scent_family"
                value={form.scent_family}
                onChange={handleChange}
                placeholder="Woody, Gourmand, Fruity…"
                required
              />
            </div>

            <div className="form-field">
              <label className="label">Size (ml)</label>
              <input
                className="input"
                type="number"
                min="1"
                name="size_ml"
                value={form.size_ml}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>

            <div className="form-field">
              <label className="label">Price (THB)</label>
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                name="price_thb"
                value={form.price_thb}
                onChange={handleChange}
                placeholder="4500"
                required
              />
            </div>

            <div className="form-field">
              <label className="label">Image URL</label>
              <input
                className="input"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://mithbangkok.com/…"
              />
            </div>
          </div>

          <div className="form-field full">
            <label className="label">Description</label>
            <textarea
              className="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short story about this fragrance…"
              rows={3}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="form-actions">
            {editingId && (
              <button
                type="button"
                className="btn secondary"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn primary" disabled={saving}>
              {saving
                ? editingId
                  ? "Saving…"
                  : "Creating…"
                : editingId
                ? "Save Changes"
                : "Create Perfume"}
            </button>
          </div>
        </form>
      </section>

      {/* Card Grid */}
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
                    Collection:{" "}
                    <span className="code">{p.collection}</span> · Scent:{" "}
                    <span className="code">{p.scent_family}</span>
                  </small>
                  <br />
                  <small>
                    Size: <span className="code">{p.size_ml} ml</span> · Price:{" "}
                    <span className="code">
                      {Number(p.price_thb).toLocaleString()} THB
                    </span>
                  </small>
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
