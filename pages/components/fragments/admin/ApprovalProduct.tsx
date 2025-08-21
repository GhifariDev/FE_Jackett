import { useEffect, useState } from "react";
import { 
  Check, X, Clock, Search, Filter, ChevronDown,
  Package, Eye, AlertCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  User, Calendar, DollarSign, Box
} from "lucide-react";

// Types - ✅ Tambahkan fleksibilitas untuk struktur data berbeda
interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string; // Primary image for backward compatibility
  images?: string[]; // Array of multiple images
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  seller?: {
    nama: string;
    email: string;
  };
  // ✅ Tambahan untuk handle struktur data yang berbeda
  user?: {
    nama?: string;
    name?: string;
    email: string;
  };
  seller_name?: string; // Jika data dari JOIN langsung
  seller_email?: string;
  owner_name?: string; // Jika menggunakan nama field lain
}

const BASE_IMAGE_URL = "http://localhost:3001/uploads/products";

// ✅ Gambar placeholder yang lebih menarik dengan beberapa variasi
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center", // Electronics
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center", // Store
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center", // Product
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop&crop=center", // Shopping
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center"  // Product 2
];

const getRandomPlaceholder = () => {
  return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
};

// ✅ Helper function untuk mendapatkan nama seller dari berbagai struktur data
const getSellerName = (product: Product): string | undefined => {
  // Coba berbagai kemungkinan struktur data
  const candidates = [
    product.seller?.nama,           // Standard structure
    product.seller?.name,           // Alternative name field
    product.user?.nama,             // If using 'user' instead of 'seller'
    product.user?.name,             // Alternative name field in user
    product.seller_name,            // Direct field from JOIN
    product.owner_name,             // Alternative field name
  ];
  
  const sellerName = candidates.find(name => 
    name && 
    typeof name === 'string' && 
    name.trim() !== '' && 
    name !== 'null' && 
    name !== 'undefined'
  );
  
  console.log('🔍 Seller name candidates:', candidates);
  console.log('🎯 Selected seller name:', sellerName);
  
  return sellerName;
};

// ✅ Helper function untuk mendapatkan email seller
const getSellerEmail = (product: Product): string | undefined => {
  const candidates = [
    product.seller?.email,
    product.user?.email,
    product.seller_email,
  ];
  
  return candidates.find(email => 
    email && 
    typeof email === 'string' && 
    email.trim() !== '' && 
    email !== 'null' && 
    email !== 'undefined'
  );
};
const getAllProductImages = (product: Product): string[] => {
  const images: string[] = [];
  
  // Jika ada array images, gunakan itu
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images.filter(img => img && img.trim() !== '');
  }
  
  // Fallback ke imageUrl tunggal
  if (product.imageUrl && product.imageUrl.trim() !== '') {
    images.push(product.imageUrl);
  }
  
  // Jika tidak ada gambar sama sekali, berikan placeholder
  if (images.length === 0) {
    images.push(getRandomPlaceholder());
  }
  
  return images;
};

// ✅ Fungsi untuk mendapatkan gambar utama (yang pertama)
const getPrimaryImage = (product: Product): string => {
  const allImages = getAllProductImages(product);
  const sellerName = getSellerName(product);
  return getImageUrl(allImages[0], sellerName);
};

// API calls - ✅ Ubah PUT ke PATCH sesuai dengan backend
const approveProduct = async (id: number) => {
  return fetch(`http://localhost:3001/api/admin-products/${id}/approve`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const rejectProduct = async (id: number) => {
  return fetch(`http://localhost:3001/api/admin-products/${id}/reject`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// ✅ Perbaiki fungsi getImageUrl dengan path seller yang terorganisir
const getImageUrl = (imageUrl: string | null | undefined, sellerName?: string) => {
  console.log('🔍 Image URL Debug:', {
    imageUrl,
    sellerName,
    sellerType: typeof sellerName,
    sellerLength: sellerName?.length
  });
  
  if (!imageUrl || imageUrl === '' || imageUrl === 'null' || imageUrl === 'undefined') {
    return getRandomPlaceholder();
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // ✅ Construct URL dengan folder seller - dengan debugging yang lebih baik
  let fullUrl: string;
  if (sellerName && sellerName.trim() !== '' && sellerName !== 'undefined' && sellerName !== 'null') {
    // Clean nama seller - lebih konservatif, hanya ganti spasi dan karakter khusus
    const cleanSellerName = sellerName.trim()
      .replace(/\s+/g, '_')           // Ganti spasi dengan underscore
      .replace(/[^\w-]/g, '_')        // Ganti karakter non-alphanumeric kecuali underscore dan dash
      .replace(/_+/g, '_')            // Gabungkan multiple underscore jadi satu
      .replace(/^_|_$/g, '');         // Hapus underscore di awal dan akhir
    
    console.log('🎯 Clean seller name:', cleanSellerName);
    fullUrl = `${BASE_IMAGE_URL}/${cleanSellerName}/${imageUrl}`;
  } else {
    console.log('⚠️ Seller name not valid, using fallback path');
    // Fallback ke path lama jika nama seller tidak ada
    fullUrl = `${BASE_IMAGE_URL}/${imageUrl}`;
  }
  
  console.log('🌐 Final image URL:', fullUrl);
  return fullUrl;
};

// ✅ Handle image error dengan fallback
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (!target.src.includes('unsplash.com')) {
    target.src = getRandomPlaceholder();
  }
};

// ✅ Image Gallery Component - Improved UI
const ImageGallery = ({ images, productTitle, sellerName }: { 
  images: string[], 
  productTitle: string, 
  sellerName?: string 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Tidak ada gambar</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Galeri Produk</h4>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Package className="w-4 h-4" />
          <span>{images.length} gambar</span>
        </div>
      </div>

      {/* Main Image */}
      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative group shadow-lg">
        <img 
          src={getImageUrl(images[currentIndex], sellerName)} 
          alt={`${productTitle} - Image ${currentIndex + 1}`} 
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105" 
          onError={handleImageError}
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Image counter with better styling */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnail strip - only show if multiple images */}
      {images.length > 1 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Semua Gambar:</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                  index === currentIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={getImageUrl(image, sellerName)}
                  alt={`${productTitle} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Product Card Component
const MobileProductCard = ({ 
  product, 
  onView, 
  onApprove, 
  onReject, 
  actionLoading 
}: {
  product: Product;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  actionLoading: boolean;
}) => {
  const productImages = getAllProductImages(product);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" /> Pending</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-video relative">
        <img
          src={getPrimaryImage(product)}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-3 left-3">
          {getStatusBadge(product.status)}
        </div>
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
          {productImages.length} foto
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.title}</h3>
          <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">{product.category}</span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Box className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{product.stock} unit</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 py-2 border-t border-gray-100">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">{getSellerName(product) || 'N/A'}</div>
            <div className="text-xs text-gray-500 truncate">{getSellerEmail(product) || 'N/A'}</div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(product.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button 
            onClick={onView}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Detail
          </button>
          
          {product.status === "PENDING" && (
            <>
              <button 
                onClick={onApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Approve
                  </>
                )}
              </button>
              <button 
                onClick={onReject}
                disabled={actionLoading}
                className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Reject
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/admin-products", { 
        credentials: "include" 
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: Product[] = await res.json();
      
      // ✅ Debug data yang diterima dari backend
      console.log('🔍 Raw data from backend:', data);
      console.log('🔍 First product sample:', data[0]);
      
      // ✅ Transform data untuk memastikan images array tersedia
      const transformedData = data.map(product => {
        console.log(`🔍 Processing product ${product.id}:`, {
          seller: product.seller,
          imageUrl: product.imageUrl,
          imageUrlType: typeof product.imageUrl,
          images: product.images
        });
        
        let processedImages: string[] = [];
        
        // Handle different imageUrl formats
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          // If images array exists, use it
          processedImages = product.images;
        } else if (product.imageUrl) {
          // Handle imageUrl yang bisa berupa string JSON atau string biasa
          if (typeof product.imageUrl === 'string') {
            // Cek apakah ini string JSON array
            if (product.imageUrl.startsWith('[') && product.imageUrl.endsWith(']')) {
              try {
                const parsedImages = JSON.parse(product.imageUrl);
                if (Array.isArray(parsedImages)) {
                  processedImages = parsedImages;
                  console.log('✅ Parsed JSON imageUrl:', parsedImages);
                } else {
                  processedImages = [product.imageUrl];
                }
              } catch (e) {
                console.error('❌ Error parsing imageUrl JSON:', e);
                processedImages = [product.imageUrl];
              }
            } else {
              // String biasa, jadikan array
              processedImages = [product.imageUrl];
            }
          } else if (Array.isArray(product.imageUrl)) {
            // Jika sudah array (meskipun tidak sesuai interface)
            processedImages = product.imageUrl as string[];
          }
        }
        
        console.log('🎯 Processed images for product', product.id, ':', processedImages);
        
        return {
          ...product,
          images: processedImages
        };
      });
      
      console.log('🎯 Final transformed data:', transformedData);
      setProducts(transformedData);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      alert("Gagal mengambil data produk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Perbaiki handle action dengan error handling yang lebih baik
  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setActionLoading(id);
    try {
      let response;
      if (action === 'approve') {
        response = await approveProduct(id);
      } else {
        response = await rejectProduct(id);
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to ${action} product: ${errorData}`);
      }

      // Update state lokal setelah berhasil
      setProducts(prev =>
        prev.map(p => p.id === id ? { 
          ...p, 
          status: action === 'approve' ? 'APPROVED' : 'REJECTED' 
        } : p)
      );
      
      alert(`Produk berhasil di-${action === 'approve' ? 'approve' : 'reject'}!`);
      
    } catch (error) {
      console.error("Error handling action:", error);
      alert(`Gagal ${action === 'approve' ? 'approve' : 'reject'} produk: ${error.message}`);
    } finally {
      setActionLoading(null);
      setSelectedProduct(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" /> Pending</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filteredProducts = products.filter(product => {
    const sellerName = getSellerName(product) || '';
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Produk</h1>
              <p className="text-sm sm:text-base text-gray-600">Kelola dan review produk yang diajukan seller</p>
            </div>
          </div>

          {/* Stats - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {[
              { label: "Total Produk", value: products.length, color: "blue", icon: Package },
              { label: "Pending", value: products.filter(p => p.status === 'PENDING').length, color: "yellow", icon: Clock },
              { label: "Approved", value: products.filter(p => p.status === 'APPROVED').length, color: "green", icon: CheckCircle },
              { label: "Rejected", value: products.filter(p => p.status === 'REJECTED').length, color: "red", icon: XCircle }
            ].map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200`}>
                      <IconComponent className={`w-4 h-4 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters - Responsive */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari produk, kategori, atau seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div className="sm:w-48 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all text-sm"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Card Grid */}
        <div className="block lg:hidden">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Tidak ada produk yang ditemukan</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-blue-600 hover:text-blue-800 text-sm">
                  Hapus filter pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <MobileProductCard
                  key={product.id}
                  product={product}
                  onView={() => setSelectedProduct(product)}
                  onApprove={() => handleAction(product.id, 'approve')}
                  onReject={() => handleAction(product.id, 'reject')}
                  actionLoading={actionLoading === product.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
                        {searchTerm && (
                          <button onClick={() => setSearchTerm("")} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                            Hapus filter pencarian
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.map(product => {
                  const productImages = getAllProductImages(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14">
                            <img
                              className="h-14 w-14 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                              src={getPrimaryImage(product)}
                              alt={product.title}
                              onError={handleImageError}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">{product.title}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{getSellerName(product) || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{getSellerEmail(product) || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Box className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{product.stock} unit</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(product.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">{productImages.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(product.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button onClick={() => setSelectedProduct(product)} className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {product.status === "PENDING" && (
                          <>
                            <button 
                              onClick={() => handleAction(product.id, 'approve')} 
                              disabled={actionLoading === product.id}
                              className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === product.id ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleAction(product.id, 'reject')} 
                              disabled={actionLoading === product.id}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === product.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Modal - Responsive */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedProduct.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Detail produk dari seller</p>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors ml-4"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                  {/* Image Gallery - Full width on mobile, 2/3 width on XL screens */}
                  <div className="xl:col-span-2">
                    <ImageGallery 
                      images={getAllProductImages(selectedProduct)} 
                      productTitle={selectedProduct.title}
                      sellerName={getSellerName(selectedProduct)}
                    />
                  </div>

                  {/* Product Details - Full width on mobile, 1/3 width on XL screens */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Product Information Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Informasi Produk</h4>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Kategori:</span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{selectedProduct.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Harga:</span>
                          <span className="text-base sm:text-lg font-bold text-green-600">{formatPrice(selectedProduct.price)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Stok:</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedProduct.stock} unit</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Status:</span>
                          {getStatusBadge(selectedProduct.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Total Gambar:</span>
                          <span className="text-sm font-semibold text-purple-600">{getAllProductImages(selectedProduct).length} gambar</span>
                        </div>
                      </div>
                    </div>

                    {/* Seller Information Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Informasi Seller</h4>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Nama:</span>
                          <span className="text-sm font-semibold text-gray-900">{getSellerName(selectedProduct) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">Email:</span>
                          <span className="text-sm text-gray-700 text-right max-w-40 break-words">{getSellerEmail(selectedProduct) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Tanggal Submit:</span>
                          <span className="text-sm text-gray-700">{formatDate(selectedProduct.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">Folder Path:</span>
                          <span className="text-xs text-gray-500 text-right max-w-40 break-words font-mono">
                            uploads/products/{(() => {
                              const sellerName = getSellerName(selectedProduct);
                              if (!sellerName || sellerName.trim() === '' || sellerName === 'undefined' || sellerName === 'null') {
                                return 'unknown';
                              }
                              return sellerName.trim()
                                .replace(/\s+/g, '_')
                                .replace(/[^\w-]/g, '_')
                                .replace(/_+/g, '_')
                                .replace(/^_|_$/g, '') || 'unknown';
                            })()}/
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Description */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6 border border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Deskripsi Produk</h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                    </div>

                    {/* Action Buttons - Only show for PENDING products */}
                    {selectedProduct.status === "PENDING" && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 sm:p-6 border border-orange-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900">Aksi Diperlukan</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Produk ini menunggu persetujuan. Silakan review gambar dan detail produk sebelum membuat keputusan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleAction(selectedProduct.id, 'approve')}
                            disabled={actionLoading === selectedProduct.id}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                          >
                            {actionLoading === selectedProduct.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="w-5 h-5" /> 
                                <span className="font-semibold">Approve</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleAction(selectedProduct.id, 'reject')}
                            disabled={actionLoading === selectedProduct.id}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                          >
                            {actionLoading === selectedProduct.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <X className="w-5 h-5" /> 
                                <span className="font-semibold">Reject</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Status Info for non-pending products */}
                    {selectedProduct.status !== "PENDING" && (
                      <div className={`rounded-xl p-4 sm:p-6 border ${
                        selectedProduct.status === 'APPROVED' 
                          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                          : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                            selectedProduct.status === 'APPROVED' 
                              ? 'bg-green-600' 
                              : 'bg-red-600'
                          }`}>
                            {selectedProduct.status === 'APPROVED' 
                              ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              : <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            }
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                            Produk {selectedProduct.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {selectedProduct.status === 'APPROVED' 
                            ? 'Produk ini telah disetujui dan akan ditampilkan di marketplace.'
                            : 'Produk ini telah ditolak dan tidak akan ditampilkan di marketplace.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}