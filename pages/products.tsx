  import { useEffect, useState } from "react";
  import { useRouter } from "next/router";
  import { ShoppingCart } from "lucide-react";
  import AOS from "aos";
  import "aos/dist/aos.css";

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
    const [cart, setCart] = useState<number[]>([]);
    const router = useRouter();

    useEffect(() => {
      AOS.init({ duration: 800, once: true });

      fetch("http://localhost:3001/api/products")
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Gagal fetch product:", err));
    }, []);

    const handleAddToCart = (id: number) => {
      setCart((prevCart) => [...prevCart, id]);
    };

    const handleDetail = (id: number) => {
      router.push(`/products/${id}`);
    };

    return (
      <section className="bg-zinc-900 py-20 px-6 md:px-12 min-h-screen">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Semua Produk
          </h2>
          <div className="text-white relative">
            <ShoppingCart size={28} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-xs rounded-full px-2 py-0.5">
                {cart.length}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <img
                src={product.imageUrl || "https://source.unsplash.com/400x400/?product"}
                alt={product.title}
                 className="w-full h-48 object-contain object-center bg-white"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white truncate">
                  {product.title}
                </h3>
                <p className="text-green-400 font-medium mt-1">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleDetail(product.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition"
                  >
                    Lihat Detail
                  </button>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  export default AllProducts;
