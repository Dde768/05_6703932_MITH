"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    collection: "",
    scent_family: "",
    size_ml: "",
    price_thb: "",
    description: "",
    image_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

  // --- READ: Fetch Data ---
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

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${apiHost}/products/${formData.id}`
        : `${apiHost}/products`;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Reset Form and Refresh List
        setFormData({
          id: null,
          name: "",
          collection: "",
          scent_family: "",
          size_ml: "",
          price_thb: "",
          description: "",
          image_url: "",
        });
        setIsEditing(false);
        fetchData(); // Reload list
      } else {
        alert("Failed to save product");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this perfume?")) return;
    try {
      await fetch(`${apiHost}/products/${id}`, { method: "DELETE" });
      fetchData(); // Reload list
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
        id: null,
        name: "",
        collection: "",
        scent_family: "",
        size_ml: "",
        price_thb: "",
        description: "",
        image_url: "",
    });
  }

  // --- UI RENDER ---
  if (loading) return <main className="container"><div className="empty">Loading MITH perfumes...</div></main>;
  if (error) return <main className="container"><div className="empty">Error: {error}</div></main>;

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">MITH Perfume Collection (Thailand)</h1>
      </header>

      {/* --- CRUD FORM SECTION --- */}
      <section style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h2>{isEditing ? "Edit Perfume" : "Add New Perfume"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
          <input type="text" name="name" placeholder="Name (e.g. Heritage Oud)" value={formData.name} onChange={handleInputChange} required style={{ padding: "8px" }} />
          <input type="text" name="collection" placeholder="Collection" value={formData.collection} onChange={handleInputChange} required style={{ padding: "8px" }} />
          <input type="text" name="scent_family" placeholder="Scent Family" value={formData.scent_family} onChange={handleInputChange} required style={{ padding: "8px" }} />
          <input type="number" name="size_ml" placeholder="Size (ml)" value={formData.size_ml} onChange={handleInputChange} required style={{ padding: "8px" }} />
          <input type="number" name="price_thb" placeholder="Price (THB)" value={formData.price_thb} onChange={handleInputChange} required style={{ padding: "8px" }} />
          <input type="text" name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleInputChange} style={{ padding: "8px" }} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ gridColumn: "span 2", padding: "8px" }} />
          
          <div style={{ gridColumn: "span 2", display: "flex", gap: "10px" }}>
            <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer" }}>
              {isEditing ? "Update Product" : "Add Product"}
            </button>
            {isEditing && (
                <button type="button" onClick={handleCancel} style={{ padding: "10px 20px", backgroundColor: "#ccc", border: "none", cursor: "pointer" }}>
                    Cancel
                </button>
            )}
          </div>
        </form>
      </section>

      {/* --- PRODUCT LIST --- */}
      {rows.length === 0 ? (
        <div className="empty">No perfumes found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {rows.map((p) => (
            <article key={p.id} className="card" tabIndex={0} style={{ position: "relative" }}>
              {p.image_url && (
                <div className="media">
                  <img src={p.image_url} alt={p.name} className="img" loading="lazy" decoding="async" />
                </div>
              )}
              <div className="body">
                <h2 className="card-title">{p.name}</h2>
                <p className="detail">{p.description}</p>
                <div className="meta">
                  <small>Collection: <span className="code">{p.collection}</span></small><br />
                  <small>Price: <span className="code">{Number(p.price_thb).toLocaleString()} THB</span></small>
                </div>
                
                {/* Edit/Delete Buttons */}
                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEdit(p)} style={{ flex: 1, padding: "5px", cursor: "pointer", backgroundColor: "#e0e0e0", border: "none" }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: "5px", cursor: "pointer", backgroundColor: "#ffcccc", color: "red", border: "none" }}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}