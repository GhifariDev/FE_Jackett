"use client";

import { useEffect, useState } from "react";
import AdminProductForm from "./components/fragments/AdminProductForm";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      else setProducts([]);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
      setProducts([]);
    }
  };

  const getImageUrl = (filename?: string) => {
    if (!filename) return "https://source.unsplash.com/400x400/?product";
    return `${API_URL}/uploads/${filename}`;
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Yakin ingin menghapus?");
    if (!confirm) return;
    const res = await fetch(`${API_URL}/api/admin-products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchProducts();
  };

  const checkAdminAccess = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const user = await res.json();
      if (user.role !== "admin") {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAdminAccess();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Produk</h2>
          <p className="text-sm sm:text-base text-gray-600">Kelola produk toko Anda</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          <AdminProductForm
            product={editingProduct}
            onSubmitSuccess={() => {
              fetchProducts();
              setEditingProduct(null);
            }}
          />
          {editingProduct && (
            <button
              onClick={() => setEditingProduct(null)}
              className="mt-4 w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Batalkan Edit
            </button>
          )}
        </div>

        {/* Products List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Daftar Produk ({products.length})
            </h3>
          </div>

          {products.length === 0 ? (
            <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Belum ada produk yang ditambahkan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((p) => (
                <div key={p.id} className="p-4 sm:px-6 sm:py-4 hover:bg-gray-50 transition-colors">
                  {/* Mobile: Stack Vertical, Desktop: Flex Horizontal */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-20 md:w-24 aspect-square overflow-hidden bg-gray-100 rounded-lg flex-shrink-0 mx-auto sm:mx-0 max-w-xs sm:max-w-none">
                      <img
                        src={getImageUrl(p.imageUrl)}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-base sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-1 line-clamp-2">
                        {p.title}
                      </h4>
                      <p className="text-lg sm:text-base font-bold text-green-600">
                        Rp {new Intl.NumberFormat('id-ID').format(p.price)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 sm:px-3 sm:py-1.5 text-sm sm:text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        <svg className="w-4 h-4 sm:w-3 sm:h-3 mr-2 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 sm:px-3 sm:py-1.5 text-sm sm:text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        <svg className="w-4 h-4 sm:w-3 sm:h-3 mr-2 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus 
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}