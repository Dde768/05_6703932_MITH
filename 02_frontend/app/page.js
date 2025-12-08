"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    collection: "",
    scent_family: "",
    size_ml: "",
    price_thb: "",
    description: "",
    image_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editId, setEditId] = useState(null);

  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

  const loadProducts = async () => {
    setLoading(true);
    setError("");
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

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      collection: "",
      scent_family: "",
      size_ml: "",
      price_thb: "",
      description: "",
      image_url: "",
    });
    setEditId(null);
    setFormError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (
      !form.name ||
      !form.collection ||
      !form.scent_family ||
      !form.size_ml ||
      !form.price_thb
    ) {
      setFormError(
        "Please fill in Name, Collection, Scent, Size (ml) and Price (THB)."
      );
      return;
    }

    const payload = {
      ...form,
      size_ml: Number(form.size_ml),
      price_thb: Number(form.price_thb),
    };

    if (Number.isNaN(payload.size_ml) || Number.isNaN(payload.price_thb)) {
      setFormError("Size (ml) and Price (THB) must be numbers.");
      return;
    }

    try {
      setIsSubmitting(true);

      const isEdit = editId !== null;
      const url = isEdit
        ? `${apiHost}/products/${editId}`
        : `${apiHost}/products`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed: ${res.status}`);
      }

      await loadProducts();
      setSuccessMsg(
        isEdit ? "Perfume updated successfully." : "Perfume created successfully."
      );
      resetForm();
    } catch (err) {
      setFormError(err.message || "Error while saving perfume.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name || "",
      collection: product.collection || "",
      scent_family: product.scent_family || "",
      size_ml: String(product.size_ml ?? ""),
      price_thb: String(product.price_thb ?? ""),
      description: product.description || "",
      image_url: product.image_url || "",
    });
    setFormError("");
    setSuccessMsg("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this perfume?");
    if (!ok) return;

    try {
      const res = await fetch(`${apiHost}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Delete failed: ${res.status}`);
      }
      setRows((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Error while deleting perfume.");
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

      {/* FORM CARD */}
      <section className="card form-card">
        <div className="form-card-header">
          <div>
            <h2 className="card-title">
              {editId === null ? "Add New Perfume" : `Edit Perfume #${editId}`}
            </h2>
            <p className="form-subtitle">
              Fill in the fragrance details and save to the collection.
            </p>
          </div>
          {editId !== null && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>

        <form className="perfume-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid-3">
            <label className="field">
              <span className="field-label">Name</span>
              <input
                className="field-input"
                name="name"
                placeholder="Heritage Oud"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Collection</span>
              <input
                className="field-input"
                name="collection"
                placeholder="Heritage / Signature"
                value={form.collection}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Scent Family</span>
              <input
                className="field-input"
                name="scent_family"
                placeholder="Woody, Gourmand, Fruity…"
                value={form.scent_family}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-grid form-grid-3">
            <label className="field">
              <span className="field-label">Size (ml)</span>
              <input
                className="field-input"
                type="number"
                name="size_ml"
                placeholder="50"
                value={form.size_ml}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Price (THB)</span>
              <input
                className="field-input"
                type="number"
                name="price_thb"
                placeholder="4500"
                value={form.price_thb}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Image URL</span>
              <input
                className="field-input"
                name="image_url"
                placeholder="https://…"
                value={form.image_url}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Description</span>
            <textarea
              className="field-input field-textarea"
              name="description"
              rows={3}
              placeholder="Rich oud and woods with subtle sweetness…"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          {formError && <p className="form-message error">{formError}</p>}
          {successMsg && <p className="form-message success">{successMsg}</p>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving…"
                : editId === null
                ? "Create Perfume"
                : "Update Perfume"}
            </button>
          </div>
        </form>
      </section>

      {/* LIST */}
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

                <div className="form-actions card-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
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

      {/* 🔥 Styles for the form & buttons */}
      <style jsx global>{`
        .form-card {
          margin-bottom: 2.5rem;
          padding: 1.75rem 2rem;
          border-radius: 24px;
          background: radial-gradient(
            circle at top,
            #151525 0,
            #050509 55%,
            #000 100%
          );
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .form-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.65);
        }

        .perfume-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-grid {
          display: grid;
          gap: 1rem;
        }

        .form-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 900px) {
          .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .field-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.6);
        }

        .field-input {
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(4, 4, 8, 0.85);
          padding: 0.6rem 0.9rem;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .field-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .field-input:focus {
          border-color: #f5d0ff;
          box-shadow: 0 0 0 1px rgba(245, 208, 255, 0.6);
          background: rgba(10, 10, 20, 0.95);
        }

        .field-textarea {
          border-radius: 18px;
          resize: vertical;
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .card-actions {
          justify-content: flex-start;
        }

        .btn-primary,
        .btn-secondary,
        .btn-danger {
          border-radius: 999px;
          padding: 0.55rem 1.3rem;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff8fd5, #ffd26f);
          color: #050509;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
        }
        .btn-primary:hover {
          filter: brightness(1.05);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #f5f5ff;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        .btn-danger {
          background: rgba(255, 88, 120, 0.18);
          color: #ffb3c5;
        }
        .btn-danger:hover {
          background: rgba(255, 88, 120, 0.32);
        }

        .form-message {
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }
        .form-message.error {
          color: #ff9ea5;
        }
        .form-message.success {
          color: #b5ffcc;
        }
      `}</style>
    </main>
  );
}
