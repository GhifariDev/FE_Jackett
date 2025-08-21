// pages/product/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Share2, Truck, Shield, Clock, Star } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cartStore';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { CreateTransactionRequest, CreateTransactionResponse } from "@/types/payment";
import { useSession } from "next-auth/react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  seller?: {
    name: string;
    email: string;
  };
  sellerName?: string;
  sellerEmail?: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const addToCart = useCartStore((state) => state.addToCart);
  const { data: session } = useSession(); // ✅ session jadi terdefinisi
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
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
    if (!filename) return 'https://via.placeholder.com/600x400?text=No+Image';
    
    if (sellerName) {
      const folderName = sellerName.toLowerCase().replace(/\s+/g, '_');
      return `${API_URL}/uploads/products/${folderName}/${filename}`;
    }
    
    return `${API_URL}/uploads/${filename}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

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
            throw new Error(errorData.message || "Failed to fetch product");
          }
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Gagal ambil detail produk:", error);
        setError("Produk tidak ditemukan atau terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_URL]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = () => {
  const productUrl = `${window.location.origin}/product/${id}`;
  const productTitle = product?.title || "Produk";

  if (navigator.share) {
    // Kalau browser support Web Share API (HP biasanya support)
    navigator.share({
      title: productTitle,
      text: `Lihat produk ini: ${productTitle}`,
      url: productUrl,
    }).catch((err) => console.error("Share gagal:", err));
  } else {
    // Fallback: copy link ke clipboard
    navigator.clipboard.writeText(productUrl)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Link disalin!",
          text: "Link produk sudah disalin ke clipboard",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => console.error("Gagal copy link:", err));
  }
};

const handleBuyNow = async () => {
  const token = Cookies.get("token");
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login Diperlukan",
      text: "Silakan login terlebih dahulu untuk melakukan pembelian.",
      confirmButtonColor: "#3B82F6",
    }).then(() => {
      router.push("/login");
    });
    return;
  }

  if (!product) {
    Swal.fire("Error", "Produk tidak ditemukan.", "error");
    return;
  }

  try {
    const body = {
      productId: product.id,
      quantity,
      userId: session?.user?.id || null, // sementara fallback null
      // atau kalau backend pakai JWT token:
      // token: token,
    };

   const response = await fetch("http://localhost:3001/api/payments/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // ✅ userId diambil dari token
  },
  body: JSON.stringify({
    productId: product?.id,
    quantity,
  }),
});


    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Gagal membuat transaksi");
    }

    const data: CreateTransactionResponse = await response.json();

    if (data.snapToken) {
      window.snap.pay(data.snapToken, {
        onSuccess: (result: any) => {
          console.log("Payment success:", result);
          Swal.fire("Berhasil", "Pembayaran berhasil!", "success");
        },
        onPending: (result: any) => {
          console.log("Payment pending:", result);
          Swal.fire("Menunggu", "Pembayaran menunggu konfirmasi.", "info");
        },
        onError: (result: any) => {
          console.error("Payment error:", result);
          Swal.fire("Gagal", "Pembayaran gagal.", "error");
        },
        onClose: () => {
          Swal.fire("Dibatalkan", "Anda menutup popup pembayaran.", "warning");
        },
      });
    } else if (data.snapRedirect) {
      window.location.href = data.snapRedirect;
    } else {
      Swal.fire(
        "Info",
        "Transaksi berhasil dibuat, tapi tidak ada payment URL.",
        "info"
      );
    }
  } catch (error: any) {
    console.error("❌ Gagal checkout:", error.message);
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Gagal melakukan checkout: " + error.message,
      confirmButtonColor: "#3B82F6",
    });
  }
};




  const handleAddToCart = async () => {
    const token = Cookies.get('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk menambahkan ke keranjang.',
        confirmButtonColor: '#3B82F6'
      }).then(() => {
        router.push('/login');
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product?.id, quantity }),
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
        text: `${quantity} produk berhasil ditambahkan ke keranjang`,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

    } catch (error: any) {
      console.error("❌ Gagal tambah ke keranjang:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: "Gagal menambahkan produk: " + error.message,
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  // Navigation functions untuk multiple images
  const nextImage = (imageUrls: string[]) => {
    setCurrentImageIndex(current => 
      current < imageUrls.length - 1 ? current + 1 : 0
    );
  };

  const prevImage = (imageUrls: string[]) => {
    setCurrentImageIndex(current => 
      current > 0 ? current - 1 : imageUrls.length - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gray-300 h-64 sm:h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 sm:h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 sm:h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error || 'Produk yang Anda cari tidak tersedia'}</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
            <ChevronLeft size={16} className="mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const imageUrls = parseImageUrls(product.imageUrl);
  const sellerName = product.seller?.name || product.sellerName;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm overflow-x-auto">
            <Link href="/" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
              Beranda
            </Link>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <Link href="/products" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">
              Produk
            </Link>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-32 sm:max-w-none">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                {imageUrls.length > 0 ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(imageUrls[currentImageIndex], sellerName)}
                      alt={`${product.title} ${currentImageIndex + 1}`}
                      className="w-full h-64 sm:h-80 lg:h-[500px] object-cover object-center cursor-pointer"
                      onClick={() => setIsImageModalOpen(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = "true";
                          target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                        }
                      }}
                    />
                    
                    {/* Image Navigation - Only show if multiple images */}
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(imageUrls)}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => nextImage(imageUrls)}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight size={20} />
                        </button>
                        
                        {/* Image Counter */}
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                          {currentImageIndex + 1}/{imageUrls.length}
                        </div>

                        {/* Zoom Indicator */}
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          🔍 Klik untuk zoom
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <img
                    src="https://via.placeholder.com/600x400?text=No+Image"
                    alt={product.title}
                    className="w-full h-64 sm:h-80 lg:h-[500px] object-cover object-center"
                  />
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {imageUrls.length > 1 && (
                <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
                  {imageUrls.map((filename, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg border-2 overflow-hidden transition-colors ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={getImageUrl(filename, sellerName)}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "true";
                            target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button 
  onClick={() => handleShare()} 
  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
>
  <Share2 size={18} />
</button>

                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 line-clamp-3">
                  {product.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                    </span>
                    {imageUrls.length > 1 && (
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                        📸 {imageUrls.length} foto
                      </span>
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                {sellerName && (
                  <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {sellerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dijual oleh</p>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">{sellerName}</p>
                    </div>
                  </div>
                )}

                {/* Rating placeholder */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8 dari 127 ulasan)</span>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Deskripsi Produk</h3>
                <div className="prose prose-sm sm:prose max-w-none">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {product.description || 'Deskripsi produk tidak tersedia.'}
                  </p>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              {product.stock > 0 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-lg sm:text-xl font-semibold text-gray-900 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center text-sm sm:text-base"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Tambah ke Keranjang
                    </button>
                  <button
  onClick={handleBuyNow}
  className="flex-1 sm:flex-none bg-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
>
  Beli Sekarang
</button>

                  </div>
                </div>
              )}

              {/* Product Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Kualitas Terjamin</p>
                    <p className="text-xs text-gray-600">Produk berkualitas tinggi</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Pengiriman Cepat</p>
                    <p className="text-xs text-gray-600">1-3 hari kerja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && imageUrls.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={getImageUrl(imageUrls[currentImageIndex], sellerName)}
              alt={`${product.title} ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={() => prevImage(imageUrls)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => nextImage(imageUrls)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} dari {imageUrls.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}