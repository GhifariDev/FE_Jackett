'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/libs/api';

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

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [displayItems, setDisplayItems] = useState<DisplayCartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCart = async () => {
        try {
          const cart = await apiFetch('/api/cart', { method: 'GET' });
          setDisplayItems(cart);
        } catch (err) {
          console.error('Gagal ambil keranjang:', err);
        }
      };
      fetchCart();
    }
  }, [isOpen]);

  const toggleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleIncreaseQty = (productId: number) => {
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQty = (productId: number) => {
    setDisplayItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const items = displayItems
        .filter((item) => selectedItems.includes(item.product.id))
        .map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

      if (items.length === 0) {
        alert('Pilih minimal 1 item untuk checkout.');
        return;
      }

      await apiFetch('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });

      alert('Order berhasil dibuat!');
      setDisplayItems((prev) => prev.filter((item) => !selectedItems.includes(item.product.id)));
      setSelectedItems([]);
    } catch (err: any) {
      alert(`Gagal checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold">Keranjang Belanja</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
        {displayItems.length === 0 && <p className="text-gray-500">Keranjang kosong.</p>}
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border-b py-4">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.product.id)}
              onChange={() => toggleSelectItem(item.product.id)}
            />
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.product.imageUrl}`}
              alt={item.product.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.product.title}</p>
              <p className="text-sm text-gray-600">
                Rp {item.product.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button className="px-2 bg-gray-300 rounded" onClick={() => handleDecreaseQty(item.product.id)}>-</button>
                <span>{item.quantity}</span>
                <button className="px-2 bg-gray-300 rounded" onClick={() => handleIncreaseQty(item.product.id)}>+</button>
              </div>
              <p className="text-sm font-medium text-blue-700 mt-1">
                Subtotal: Rp {(item.quantity * item.product.price).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Memproses...' : 'Checkout Terpilih'}
        </button>
      </div>
    </div>
  );
}
