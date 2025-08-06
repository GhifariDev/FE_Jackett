import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ShoppingCart, Filter, Search, Grid, List } from "lucide-react";
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  // Tambahkan produk ke keranjang
  const handleAddToCart = async (productId: number) => {
    try {
      const response = await fetch("http://localhost:3001/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⬅️ Penting: agar cookie JWT ikut terkirim
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menambahkan ke keranjang");
      }

      setCart((prevCart) => [...prevCart, productId]);
      alert("✅ Produk berhasil ditambahkan ke keranjang");
    } catch (error: any) {
      console.error("❌ Gagal tambah ke keranjang:", error.message);
      alert("Gagal menambahkan produk: " + error.message);
    }
  };

  const handleDetail = (id: number) => {
    router.push(`/products/${id}`);
  };

  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <section className="bg-gray-50 mt-60 min-h-screen py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Koleksi Produk
            </h1>
            <p className="text-gray-600">
              Temukan produk fashion terbaik untuk gaya Anda
            </p>
          </div>

          {/* Cart Icon */}
          <div className="relative">
            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
              <ShoppingCart size={20} className="text-gray-600" />
              <span className="text-gray-700 font-medium">Keranjang</span>
              {cart.length > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "Semua Kategori" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Produk tidak ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredProducts.map((product, i) => (
              viewMode === "grid" ? (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 group"
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.imageUrl || "https://source.unsplash.com/400x400/?product"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      {product.category && (
                        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                          {product.category}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleDetail(product.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 px-4 rounded-lg font-medium transition-colors"
                      >
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
                  data-aos="fade-right"
                  data-aos-delay={i * 30}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 aspect-square overflow-hidden bg-gray-50 rounded-lg flex-shrink-0">
                      <img
                        src={product.imageUrl || "https://source.unsplash.com/400x400/?product"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {product.category && (
                          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                            {product.category}
                          </span>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.description || "Deskripsi produk akan ditampilkan di sini."}
                        </p>
                        <p className="text-3xl font-bold text-blue-600 mb-4">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDetail(product.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg font-medium transition-colors"
                        >
                          Lihat Detail
                        </button>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 px-6 rounded-lg font-medium transition-colors"
                        >
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProducts;