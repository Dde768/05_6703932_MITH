"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getPerfumes() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/products`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRows(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getPerfumes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="p-10 bg-[#050509] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        MITH Perfume Collection (Thailand)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rows.map((p) => (
          <div key={p.id} className="bg-black/50 rounded-xl p-4 shadow-lg">
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-64 object-cover rounded-lg mb-3"
            />
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-400">{p.description}</p>
            <p className="mt-2 text-sm text-gray-300">
              Size: {p.size_ml} ml · Price: {p.price_thb} THB
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
