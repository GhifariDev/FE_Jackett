"use client";

import { useEffect, useState, useCallback } from "react";
import AdminProductForm from "./components/fragments/AdminProductForm";
import { useRouter } from "next/navigation";
import UsersPage from "./components/fragments/admin/User";
import Analytics from "./components/fragments/admin/Analistik";
import ApprovalProduct from "./components/fragments/admin/ApprovalProduct";
// import SellerApproval from "./components/fragments/admin/SellerApproval";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [activeMenu, setActiveMenu] = useState('products');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchProducts = useCallback(async () => {
  if (isLoading) return; // Prevent multiple calls
  
  try {
    setIsLoading(true);
    const res = await fetch(`${API_URL}/api/products`, {
      credentials: "include",
    });
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
    else setProducts([]);
  } catch (err) {
    console.error("Gagal memuat produk:", err);
    setProducts([]);
  } finally {
    setIsLoading(false);
  }
}, [API_URL, isLoading]);

  // Function untuk parse imageUrl yang berupa string array
  const parseImageUrls = (imageUrl?: string) => {
    if (!imageUrl) return [];
    try {
      // Parse JSON string ke array
      const parsed = JSON.parse(imageUrl);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      // Jika bukan JSON, anggap sebagai string tunggal
      return [imageUrl];
    }
  };

  const getImageUrl = (filename?: string, sellerName?: string) => {
    if (!filename) return "/api/placeholder/400/400";
    
    // Jika ada sellerName, gunakan folder khusus seller
    if (sellerName) {
      // Format nama folder: ganti spasi dengan underscore, lowercase
      const folderName = sellerName.toLowerCase().replace(/\s+/g, '_');
      return `${API_URL}/uploads/products/${folderName}/${filename}`;
    }
    
    // Fallback ke folder uploads langsung
    return `${API_URL}/uploads/${filename}`;
  };

  const handleRefreshProducts = useCallback(() => {
    if (!isLoading) {
      fetchProducts();
    }
  }, [fetchProducts, isLoading]);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Yakin ingin menghapus?");
    if (!confirm) return;
    const res = await fetch(`${API_URL}/api/admin-products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) handleRefreshProducts();
  };

const checkAdminAccess = useCallback(async () => {
  try {
    const res = await fetch(`${API_URL}/api/me`, {
      credentials: "include"
    });

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const user = await res.json();
    const roles = user.roles?.map((r: any) => r.role.name) || [];

    if (!roles.includes("admin")) {
      router.push("/login");
      return;
    }
  } catch (error) {
    router.push("/login");
  }
}, [API_URL, router]);

  useEffect(() => {
    let mounted = true;
    
    const initializeData = async () => {
      if (!mounted) return;
      
      await checkAdminAccess();
      if (mounted) {
        await fetchProducts();
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array

const menuItems = [
  {
id: 'sellerApproval',
name: 'Persetujuan Seller',
icon: (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)
}
,
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-4-2-4 2V5z" />
      </svg>
    )
  },
  {
    id: 'products',
    name: 'Produk',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    id: 'orders',
    name: 'Pesanan',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    id: 'users',
    name: 'Pengguna',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  {
    id: 'analytics',
    name: 'Analitik',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

return (
  <div className="flex h-screen bg-gray-100">
    {/* Mobile Sidebar Overlay */}
    {sidebarOpen && (
      <div className="fixed inset-0 z-40 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
      </div>
    )}

    {/* Sidebar */}
    <div className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200">
        <div className="flex items-center min-w-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="ml-3 text-lg sm:text-xl font-semibold text-gray-900 truncate">Admin Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeMenu === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="ml-3 truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center min-w-0">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <button className="text-xs text-gray-500 hover:text-gray-700">Logout</button>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 -ml-2 mr-2 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 capitalize truncate">
              {activeMenu === 'products' ? 'Manajemen Produk' : 
               activeMenu === 'sellerApproval' ? 'Persetujuan Seller' : 
               activeMenu}
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l2 2 4-4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {activeMenu === 'products' && (
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Produk</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Produk Aktif</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{products.filter(p => p.stock > 0).length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sm:col-span-2 xl:col-span-1">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.318 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Stok Habis</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900">{products.filter(p => p.stock === 0).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <AdminProductForm
                product={editingProduct}
                onSubmitSuccess={() => {
                  fetchProducts();
                  setEditingProduct(null);
                }}
              />
              {editingProduct && (
                <button
                  onClick={() => setEditingProduct(null)}
                  className="mt-4 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Batalkan Edit
                </button>
              )}
            </div>

            {/* Products List Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Daftar Produk ({products.length})
                </h3>
              </div>

              {products.length === 0 ? (
                <div className="px-4 sm:px-6 py-12 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm sm:text-base">Belum ada produk yang ditambahkan</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {products.map((p) => {
                    const imageUrls = parseImageUrls(p.imageUrl);
                    return (
                      <div key={p.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                          {/* Product Images */}
                          <div className="flex-shrink-0">
                            {imageUrls.length > 0 ? (
                              <div className="flex gap-2 overflow-x-auto max-w-full sm:max-w-xs">
                                {imageUrls.map((filename, index) => (
                                  <div key={index} className="w-16 h-16 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={getImageUrl(filename, p.seller?.name)}
                                      alt={`${p.title} ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        if (!target.dataset.fallback) {
                                          target.dataset.fallback = "true";
                                          target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMS4zMzMzIDIxLjMzMzNIMTZWNDIuNjY2N0g0OFYyMS4zMzMzSDQyLjY2NjdMMzkuOTk5OSAxOC42NjY3SDI0TDIxLjMzMzMgMjEuMzMzM1oiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHA+dGggZD0iTTMyIDM0LjY2NjdDMzQuOTQ1NSAzNC42NjY3IDM3LjMzMzMgMzIuMjc4OSAzNy4zMzMzIDI5LjMzMzNDMzcuMzMzMyAyNi4zODc4IDM0Ljk0NTUgMjQgMzIgMjRDMjkuMDU0NSAyNCAyNi42NjY3IDI2LjM4NzggMjYuNjY2NyAyOS4zMzMzQzI2LjY2NjcgMzIuMjc4OSAyOS4wNTQ1IDM0LjY2NjcgMzIgMzQuNjY2N1oiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                                        }
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={getImageUrl("", p.seller?.name)}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                              {p.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{p.category}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                              <span className="font-bold text-green-600 text-sm sm:text-base">
                                Rp {new Intl.NumberFormat('id-ID').format(p.price)}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                p.stock > 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                Stock: {p.stock}
                              </span>
                              {imageUrls.length > 0 && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                  {imageUrls.length} gambar
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                              <svg className="w-3 h-3 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="hidden sm:inline ml-1">Edit</span>
                            </button>

                            <button
                              onClick={() => handleDelete(p.id)}
                              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            >
                              <svg className="w-3 h-3 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="hidden sm:inline ml-1">Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeMenu === 'users' && (
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
            <UsersPage/>
          </div>
        )}

        {activeMenu === 'sellerApproval' && (
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
            <ApprovalProduct/>
          </div>
        )}

        {activeMenu === 'analytics' && (
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Analitik</h1>
            <Analytics />
          </div>
        )}

        {activeMenu !== 'products' && activeMenu !== 'users' && activeMenu !== 'sellerApproval' && activeMenu !== 'analytics' && (
          <div className="p-6 sm:p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fitur dalam pengembangan</h3>
              <p className="text-sm text-gray-500">Halaman ini sedang dalam tahap pengembangan dan akan segera tersedia.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
);
}