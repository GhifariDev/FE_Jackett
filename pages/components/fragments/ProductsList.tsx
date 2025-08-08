"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/products", {
          method: "GET",
          credentials: "include", // ⬅️ pakai cookie kalau login
        });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Gagal fetch produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
          <p className="text-gray-700 mt-1">Rp {product.price.toLocaleString()}</p>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="mt-2 h-32 w-full object-cover rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}
