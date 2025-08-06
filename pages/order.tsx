// src/pages/orders.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/libs/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiFetch('/api/orders/me')
      .then(setOrders)
      .catch((err) => {
        alert(`Gagal ambil data: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Riwayat Pesanan</h1>

      {orders.map((order: any) => (
        <div key={order.id} className="border p-4 mb-4 rounded shadow">
          <div>
            <strong>Order ID:</strong> {order.id}
          </div>
          <div>
            <strong>Status:</strong> {order.status}
          </div>
          <div className="mt-2">
            <strong>Item:</strong>
            <ul className="list-disc ml-6">
              {order.items.map((item: any, idx: number) => (
                <li key={idx}>
                  Produk ID: {item.productId} | Qty: {item.quantity} | Harga: Rp{item.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
