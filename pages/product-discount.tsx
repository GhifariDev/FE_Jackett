"use client";

import { useEffect, useState } from "react";

export default function DiscountedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/products/discounts/active", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Gagal fetch produk diskon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  // 🔹 helper untuk format harga
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Produk Diskon Aktif</h1>
      {products.length === 0 ? (
        <p>Tidak ada produk diskon saat ini.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="p-4 border rounded-lg shadow flex gap-4"
            >
              {/* ✅ tampilkan gambar */}
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-24 h-24 object-cover rounded"
              />

              <div>
                <h2 className="font-semibold text-lg">{product.title}</h2>
                <p className="line-through text-gray-500">
                  Harga Normal: {formatRupiah(product.originalPrice)}
                </p>
                <p className="text-red-600 font-semibold">
                  Harga Diskon: {formatRupiah(product.finalPrice)}
                </p>
                <p className="text-sm text-gray-600">
                  Berlaku:{" "}
                  {new Date(product.discountStart).toLocaleDateString("id-ID")} -{" "}
                  {new Date(product.discountEnd).toLocaleDateString("id-ID")}
                </p>
                <p className="text-green-600 font-medium">
                  Diskon: {product.discountPercent}%
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
