import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'; // jika kamu pakai cookies
import { ShoppingCart, Filter, Search, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useCartStore, CartItem } from '@/store/cartStore'

type Product = {
  id: number;
  title: string;
  price: number;
  category?: string;
  description?: string;
  imageUrl?: string;
  seller?: {
    name: string;
    email: string;
  };
};

const AllProducts = ({ product }: { product: CartItem }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: number]: number}>({});
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart)

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Function untuk parse imageUrl yang berupa string array
  const parseImageUrls = (imageUrl?: string) => {
    if (!imageUrl) return [];
    try {
      const parsed = JSON.parse(imageUrl);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      return [imageUrl];
    }
  };

  const getImageUrl = (filename?: string, sellerName?: string) => {
    if (!filename) return "https://source.unsplash.com/400x400/?product";
    
    if (sellerName) {
      const folderName = sellerName.toLowerCase().replace(/\s+/g, '_');
      return `${API_URL}/uploads/products/${folderName}/${filename}`;
    }
    
    return `${API_URL}/uploads/${filename}`;
  };

  // Function untuk navigasi gambar
  const nextImage = (productId: number, maxIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) < maxIndex ? (prev[productId] || 0) + 1 : 0
    }));
  };

  const prevImage = (productId: number, maxIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) > 0 ? (prev[productId] || 0) - 1 : maxIndex
    }));
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      console.log("Fetch products mulai...");
      setLoading(true);

      const response = await fetch(`${API_URL}/api/products`, {
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Response error message:", errorData.message);

        if (errorData.message === "blocked") {
          console.log("User diblokir, redirect ke login...");
          window.location.href = "/login";
          return;
        } else if (response.status === 401) {
          console.log("Unauthorized, redirect ke login...");
          window.location.href = "/login";
          return;
        } else {
          throw new Error(errorData.message || "Failed to fetch products");
        }
      }

      const data = await response.json();
      console.log("Data produk berhasil didapat:", data);

      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      console.log("Fetch products selesai.");
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

  const handleAddToCart = async (productId: number) => {
    const token = Cookies.get('token');
    if (!token) {
      alert("Silakan login terlebih dahulu untuk menambahkan ke keranjang.");
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menambahkan ke keranjang");
      }

      const data = await response.json();
      const cartItemFromApi = data.cartItem;

      const itemToAdd = {
        productId: cartItemFromApi.productId,
        title: cartItemFromApi.product.title,
        price: cartItemFromApi.product.price,
        quantity: cartItemFromApi.quantity,
      };

      addToCart(itemToAdd);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Produk berhasil ditambahkan ke keranjang',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

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
      <section className="bg-gray-50 mt-16 sm:mt-20 lg:mt-60 min-h-screen py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-48 sm:w-64 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-300"></div>
                  <div className="p-4 sm:p-6">
                    <div className="h-3 sm:h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-8 sm:h-10 bg-gray-300 rounded"></div>
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
    <section className="bg-gray-50 min-h-screen py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Koleksi Produk
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Temukan produk fashion terbaik untuk gaya Anda
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2 min-w-0">
                <Filter size={16} className="text-gray-500 flex-shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2.5 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base min-w-0"
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
                  className={`p-2.5 sm:p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 sm:p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto mb-4 sm:w-16 sm:h-16" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Produk tidak ditemukan
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </div>
        ) : (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            : "space-y-4 sm:space-y-6"
          }>
            {filteredProducts.map((product, i) => {
              const imageUrls = parseImageUrls(product.imageUrl);
              const currentIndex = currentImageIndex[product.id] || 0;
              
              return viewMode === "grid" ? (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 group"
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                >
                  {/* Image Gallery */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {imageUrls.length > 0 ? (
                      <>
                        <img
                          src={getImageUrl(imageUrls[currentIndex], product.seller?.name)}
                          alt={`${product.title} ${currentIndex + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.fallback) {
                              target.dataset.fallback = "true";
                              target.src = "https://source.unsplash.com/400x400/?product";
                            }
                          }}
                        />
                        
                        {/* Image Navigation - Only show if multiple images */}
                        {imageUrls.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImage(product.id, imageUrls.length - 1)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              onClick={() => nextImage(product.id, imageUrls.length - 1)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight size={16} />
                            </button>
                            
                            {/* Image Indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                              {imageUrls.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(prev => ({...prev, [product.id]: index}))}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>

                            {/* Image Counter */}
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                              {currentIndex + 1}/{imageUrls.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <img
                        src="https://source.unsplash.com/400x400/?product"
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="mb-4">
                      {product.category && (
                        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                          {product.category}
                        </span>
                      )}
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-lg sm:text-2xl font-bold text-blue-600">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleDetail(product.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base"
                      >
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300"
                  data-aos="fade-right"
                  data-aos-delay={i * 30}
                >
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    {/* Image Gallery for List View */}
                    <div className="w-full md:w-48 lg:w-56 flex-shrink-0">
                      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                        {imageUrls.length > 0 ? (
                          <>
                            <img
                              src={getImageUrl(imageUrls[currentIndex], product.seller?.name)}
                              alt={`${product.title} ${currentIndex + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.dataset.fallback) {
                                  target.dataset.fallback = "true";
                                  target.src = "https://source.unsplash.com/400x400/?product";
                                }
                              }}
                            />
                            
                            {/* Image Navigation for List View */}
                            {imageUrls.length > 1 && (
                              <>
                                <button
                                  onClick={() => prevImage(product.id, imageUrls.length - 1)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-opacity"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                <button
                                  onClick={() => nextImage(product.id, imageUrls.length - 1)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-opacity"
                                >
                                  <ChevronRight size={16} />
                                </button>
                                
                                {/* Image Indicators */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {imageUrls.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentImageIndex(prev => ({...prev, [product.id]: index}))}
                                      className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                                      }`}
                                    />
                                  ))}
                                </div>

                                {/* Image Counter */}
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                  {currentIndex + 1}/{imageUrls.length}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <img
                            src="https://source.unsplash.com/400x400/?product"
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Thumbnail Gallery for List View */}
                      {imageUrls.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto">
                          {imageUrls.map((filename, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(prev => ({...prev, [product.id]: index}))}
                              className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                                index === currentIndex ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img
                                src={getImageUrl(filename, product.seller?.name)}
                                alt={`${product.title} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (!target.dataset.fallback) {
                                    target.dataset.fallback = "true";
                                    target.src = "https://source.unsplash.com/400x400/?product";
                                  }
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {product.category && (
                          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                            {product.category}
                          </span>
                        )}
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                          {product.description || "Deskripsi produk akan ditampilkan di sini."}
                        </p>
                        <p className="text-xl sm:text-3xl font-bold text-blue-600 mb-4">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                        {imageUrls.length > 1 && (
                          <p className="text-xs sm:text-sm text-gray-500 mb-4">
                            📸 {imageUrls.length} foto tersedia
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => handleDetail(product.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 sm:px-6 rounded-lg font-medium transition-colors text-sm sm:text-base"
                        >
                          Lihat Detail
                        </button>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 px-4 sm:px-6 rounded-lg font-medium transition-colors text-sm sm:text-base"
                        >
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProducts;