import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  category?: string;
  description?: string;
  imageUrl?: string;
};

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Gagal fetch product:", err));
  }, []);

  return (
    <section className="bg-black py-20 px-6 md:px-12 min-h-screen">
      <h2 className="text-4xl font-extrabold text-white mb-12 text-center tracking-tight">
        Semua Produk
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300"
          >
            <img
              src={product.imageUrl || "https://source.unsplash.com/400x400/?jacket"}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white mb-1">
                {product.title}
              </h3>
              <p className="text-green-400 font-medium text-sm">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition duration-200">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;
