'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/libs/api';

interface CartItem {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
}

interface DisplayCartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: 1, quantity: 2 },
    { productId: 5, quantity: 1 },
  ]);
  const [displayItems, setDisplayItems] = useState<DisplayCartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch product detail
useEffect(() => {
  const fetchProducts = async () => {
    const items: DisplayCartItem[] = [];

    for (const item of cartItems) {
      try {
        const product = await apiFetch(`/api/products/${item.productId}`);
        items.push({ product, quantity: item.quantity });
      } catch (err) {
        console.error('Gagal ambil produk:', err);
      }
    }

    setDisplayItems(items);
  };

  fetchProducts();
}, [cartItems]);


  const handleCheckout = async () => {
    try {
      setLoading(true);
      await apiFetch('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({ items: cartItems }),
      });

      alert('Order berhasil dibuat!');
      setCartItems([]);
      setDisplayItems([]);
    } catch (err: any) {
      alert(`Gagal checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>

      {displayItems.length === 0 && <p className="text-gray-500">Keranjang kosong.</p>}

      {displayItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4 border-b py-4">
          <img src={item.product.imageUrl} alt={item.product.title} className="w-16 h-16 object-cover" />
          <div>
            <p className="font-semibold">{item.product.title}</p>
            <p className="text-sm text-gray-600">Rp {item.product.price.toLocaleString()}</p>
            <p className="text-sm">Qty: {item.quantity}</p>
            <p className="text-sm font-medium text-blue-700">
              Subtotal: Rp {(item.quantity * item.product.price).toLocaleString()}
            </p>
          </div>
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
