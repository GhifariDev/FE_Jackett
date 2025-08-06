// src/pages/cart.tsx
'use client';

import { useState } from 'react';
import { apiFetch } from '@/libs/api';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { productId: 1, quantity: 2 },
    { productId: 5, quantity: 1 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({ items: cartItems }),
      });

      alert('Order berhasil dibuat!');
      setCartItems([]);
    } catch (err: any) {
      alert(`Gagal checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
      {cartItems.map((item, idx) => (
        <div key={idx} className="border-b py-2">
          Produk ID: {item.productId} - Qty: {item.quantity}
        </div>
      ))}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Memproses...' : 'Checkout Sekarang'}
      </button>
    </div>
  );
}
