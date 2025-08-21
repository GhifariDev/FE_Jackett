import React, { useEffect, useState } from 'react';

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    title: string;
    imageUrl?: string;
  };
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error(err);
        alert('Gagal load orders');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (orders.length === 0) return <div>Tidak ada order</div>;

  // Hitung total keseluruhan semua order (qty * price)
  const totalAllOrders = orders.reduce((accOrder, order) => {
    const totalOrder = order.orderItems.reduce((accItem, item) => accItem + item.quantity * item.price, 0);
    return accOrder + totalOrder;
  }, 0);

  const handleBayarSekarang = () => {
    alert(`Total bayar untuk semua order: Rp ${totalAllOrders.toLocaleString('id-ID')}`);
    // Bisa ditambah redirect ke payment page dsb
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Riwayat Order</h1>
      {orders.map((order) => (
        <div key={order.id} className="mb-8 border p-4 rounded shadow">
          <h2 className="font-semibold">Order #{order.id}</h2>
          <p>Status: {order.status}</p>
          <p>Tanggal: {new Date(order.createdAt).toLocaleString()}</p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Produk:</h3>
            <ul>
              {order.orderItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4 mb-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.product.imageUrl}`}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p>{item.product.title}</p>
                    <p>
                      Qty: {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    <p>Total: Rp {(item.quantity * item.price).toLocaleString('id-ID')}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Button bayar sekarang */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleBayarSekarang}
          className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
        >
          Bayar Sekarang (Rp {totalAllOrders.toLocaleString('id-ID')})
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
