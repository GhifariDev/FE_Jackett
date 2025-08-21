// ====================
// TYPES
// ====================
export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string[]; // array URL gambar
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  userId: number; // ID seller
}

// ====================
// API CONFIG
// ====================
const API_URL = "http://localhost:3001/api/admin-products";

// ====================
// SERVICES
// ====================

// Ambil semua produk (hanya admin)
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(API_URL, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal mengambil daftar produk");
  return res.json();
}

// Approve produk
export async function approveProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}/approve`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Gagal approve produk");
  return res.json();
}

// Reject produk
export async function rejectProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}/reject`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Gagal reject produk");
  return res.json();
}
