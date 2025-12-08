// 02_frontend/app/page.js
"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiHost =
          process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

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

    fetchData();
  }, []);

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
