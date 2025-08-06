import { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  Search, 
  Grid, 
  List, 
  Percent,
  Star,
  Clock,
  Tag,
  Flame,
  TrendingDown
} from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  category?: string;
  description?: string;
  imageUrl?: string;
  rating: number;
  sold: number;
  timeLeft?: string;
  isFlashSale?: boolean;
  isBestDeal?: boolean;
}

interface FilterOptions {
  category: string;
  discountRange: string;
  sortBy: string;
}

const ProductsDiscount = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    discountRange: "all",
    sortBy: "discount"
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filters]);

  const fetchDiscountedProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      // Simulated API call - replace with actual endpoint
      const mockProducts: Product[] = [
        {
          id: 1,
          title: "Jaket Bomber Premium",
          price: 299000,
          originalPrice: 499000,
          discount: 40,
          category: "Jacket",
          description: "Jaket bomber stylish dengan bahan premium dan desain modern",
          imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
          rating: 4.8,
          sold: 127,
          timeLeft: "2 hari 14 jam",
          isFlashSale: true,
          isBestDeal: true
        },
        {
          id: 2,
          title: "Kemeja Formal Slim Fit",
          price: 179000,
          originalPrice: 299000,
          discount: 40,
          category: "Shirt",
          description: "Kemeja formal dengan cut slim fit untuk tampilan profesional",
          imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
          rating: 4.6,
          sold: 89,
          isBestDeal: false
        },
        {
          id: 3,
          title: "Kaos Vintage Oversized",
          price: 89000,
          originalPrice: 149000,
          discount: 40,
          category: "T-Shirt",
          description: "Kaos vintage dengan cut oversized untuk gaya kasual",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          rating: 4.5,
          sold: 203,
          timeLeft: "5 jam 23 menit",
          isFlashSale: true
        },
        {
          id: 4,
          title: "Celana Chino Premium",
          price: 199000,
          originalPrice: 329000,
          discount: 39,
          category: "Pants",
          description: "Celana chino dengan bahan premium untuk berbagai occasion",
          imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop",
          rating: 4.7,
          sold: 156
        },
        {
          id: 5,
          title: "Hoodie Street Style",
          price: 249000,
          originalPrice: 399000,
          discount: 38,
          category: "Hoodie",
          description: "Hoodie dengan desain street style yang trendy",
          imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
          rating: 4.9,
          sold: 91,
          isBestDeal: true
        },
        {
          id: 6,
          title: "Dress Casual Elegant",
          price: 159000,
          originalPrice: 279000,
          discount: 43,
          category: "Dress",
          description: "Dress casual dengan sentuhan elegant untuk berbagai acara",
          imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
          rating: 4.4,
          sold: 67
        }
      ];
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (): void => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Discount range filter
    if (filters.discountRange !== "all") {
      const [min, max] = filters.discountRange.split("-").map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.discount >= min && product.discount <= max;
        }
        return product.discount >= min;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "discount":
          return b.discount - a.discount;
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "sold":
          return b.sold - a.sold;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (id: number): void => {
    setCart((prevCart) => [...prevCart, id]);
    // Show simple alert for demo purposes
    alert(`Produk dengan ID ${id} ditambahkan ke keranjang!`);
  };

  const handleDetail = (id: number): void => {
    // For demo purposes, show alert instead of routing
    alert(`Menampilkan detail produk dengan ID ${id}`);
  };

  const calculateSavings = (originalPrice: number, currentPrice: number): number => {
    return originalPrice - currentPrice;
  };

  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <section className="bg-gray-50 min-h-screen py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-96 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-64 mb-8"></div>
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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-red-600 via-pink-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Percent className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
         JAXEL DISCOUNT
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            Dapatkan diskon hingga 50% untuk semua koleksi fashion terbaik kami!
          </p>
          <div className="flex justify-center items-center gap-4 text-lg">
            <Flame className="w-6 h-6 text-orange-300" />
            <span>Terbatas! Jangan sampai terlewat</span>
            <Flame className="w-6 h-6 text-orange-300" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Cart */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Produk Diskon Terbaik
              </h2>
              <p className="text-gray-600">
                Koleksi produk dengan penawaran terbaik dan diskon menarik
              </p>
            </div>

            {/* Cart Icon */}
            <div className="relative">
              <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm">
                <ShoppingCart size={20} className="text-gray-600" />
                <span className="text-gray-700 font-medium">Keranjang</span>
                {cart.length > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari produk diskon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "Semua Kategori" : category}
                    </option>
                  ))}
                </select>

                {/* Discount Filter */}
                <select
                  value={filters.discountRange}
                  onChange={(e) => setFilters({ ...filters, discountRange: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="all">Semua Diskon</option>
                  <option value="10-20">10% - 20%</option>
                  <option value="21-30">21% - 30%</option>
                  <option value="31-40">31% - 40%</option>
                  <option value="41-50">41% - 50%</option>
                  <option value="51">50%+</option>
                </select>

                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="discount">Diskon Tertinggi</option>
                  <option value="price">Harga Terendah</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="sold">Terlaris</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
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
              Menampilkan {filteredProducts.length} produk diskon
            </p>
            <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
              <TrendingDown size={16} />
              <span>Harga sudah termasuk diskon</span>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Produk tidak ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah kata kunci pencarian atau filter
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
              : "space-y-6"
            }>
              {filteredProducts.map((product, i) => (
                viewMode === "grid" ? (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group relative"
                  >
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                      {product.isFlashSale && (
                        <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Flame size={10} />
                          Flash Sale
                        </div>
                      )}
                      {product.isBestDeal && (
                        <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Tag size={10} />
                          Best Deal
                        </div>
                      )}
                    </div>

                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.imageUrl || "https://source.unsplash.com/400x400/?fashion"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        {product.category && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                            {product.category}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        
                        {/* Rating and Sold */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.sold} terjual
                          </div>
                        </div>

                        {/* Prices */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-red-600">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </span>
                        </div>
                        
                        <div className="text-sm text-green-600 font-medium">
                          Hemat Rp {calculateSavings(product.originalPrice, product.price).toLocaleString("id-ID")}
                        </div>

                        {/* Timer for Flash Sale */}
                        {product.timeLeft && (
                          <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
                            <Clock size={14} />
                            <span>Berakhir dalam {product.timeLeft}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleDetail(product.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                        >
                          Lihat Detail
                        </button>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="w-full bg-white border border-red-600 text-red-600 hover:bg-red-50 py-2.5 px-4 rounded-lg font-medium transition-colors"
                        >
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300 relative"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative">
                        <div className="w-full md:w-48 aspect-square overflow-hidden bg-gray-50 rounded-lg flex-shrink-0">
                          <img
                            src={product.imageUrl || "https://source.unsplash.com/400x400/?fashion"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{product.discount}%
                          </div>
                          {product.isFlashSale && (
                            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <Flame size={10} />
                              Flash
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {product.category && (
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                              {product.category}
                            </span>
                          )}
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {product.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {product.description || "Deskripsi produk akan ditampilkan di sini."}
                          </p>
                          
                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-yellow-500 fill-current" />
                              <span className="text-gray-600">{product.rating}</span>
                            </div>
                            <div className="text-gray-500">
                              {product.sold} terjual
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-bold text-red-600">
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                              Rp {product.originalPrice.toLocaleString("id-ID")}
                            </span>
                          </div>
                          
                          <div className="text-green-600 font-medium mb-4">
                            Hemat Rp {calculateSavings(product.originalPrice, product.price).toLocaleString("id-ID")}
                          </div>

                          {product.timeLeft && (
                            <div className="flex items-center gap-1 text-orange-600 mb-4">
                              <Clock size={16} />
                              <span>Berakhir dalam {product.timeLeft}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDetail(product.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-6 rounded-lg font-medium transition-colors"
                          >
                            Lihat Detail
                          </button>
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            className="flex-1 bg-white border border-red-600 text-red-600 hover:bg-red-50 py-2.5 px-6 rounded-lg font-medium transition-colors"
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
    </div>
  );
};

export default ProductsDiscount;