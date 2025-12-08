"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
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
  const [editId, setEditId] = useState(null); // null = create mode

  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

  // load products
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

  // generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // reset form to create mode
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
  };

  // submit create / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    // basic validation
    if (
      !form.name ||
      !form.collection ||
      !form.scent_family ||
      !form.size_ml ||
      !form.price_thb
    ) {
      setFormError(
        "Please fill in name, collection, scent family, size (ml) and price (THB)."
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
      setSuccessMsg(isEdit ? "Product updated successfully." : "Product created successfully.");
      resetForm();
    } catch (err) {
      setFormError(err.message || "Error while saving product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // when clicking "Edit" on a card
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
    // scroll to top where the form is
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // delete a product
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      const res = await fetch(`${apiHost}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Delete failed: ${res.status}`);
      }
      // remove from state without reloading all
      setRows((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Error while deleting product.");
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

      {/* Create / Edit form */}
      <section className="card" style={{ marginBottom: "2rem" }}>
        <h2 className="card-title">
          {editId === null ? "Add New Perfume" : `Edit Perfume #${editId}`}
        </h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Collection
              <input
                name="collection"
                value={form.collection}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Scent Family
              <input
                name="scent_family"
                value={form.scent_family}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Size (ml)
              <input
                name="size_ml"
                type="number"
                value={form.size_ml}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Price (THB)
              <input
                name="price_thb"
                type="number"
                value={form.price_thb}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Image URL
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </label>

          {formError && <p className="error">{formError}</p>}
          {successMsg && <p className="success">{successMsg}</p>}

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : editId === null
                ? "Create Perfume"
                : "Update Perfume"}
            </button>
            {editId !== null && (
              <button
                type="button"
                onClick={resetForm}
                style={{ marginLeft: "0.75rem" }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* List of perfumes */}
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

                <div className="form-actions" style={{ marginTop: "0.75rem" }}>
                  <button type="button" onClick={() => handleEditClick(p)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: "0.5rem" }}
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
