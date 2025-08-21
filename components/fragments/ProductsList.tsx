"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const INITIAL_DISPLAY_COUNT = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:3001/api/products", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products || data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Akun anda Terblokir oleh Admin")
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Determine which products to display
  const displayedProducts = showAll ? products : products.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreProducts = products.length > INITIAL_DISPLAY_COUNT;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600">Loading produk...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600">Produk tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold my-6 sm:my-8 lg:my-10 text-gray-800">
        Produk Kami
      </h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
        {displayedProducts.map((product) => (
          <Link href="/products" key={product.id}>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Image Container - Responsive Heights */}
              <div className="relative bg-gray-100 overflow-hidden">
                {product.imageUrl ? (
                  <div className="aspect-square">
                    <img
                      src={`http://localhost:3001/uploads/${product.imageUrl}`}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-200">
                              <div class="text-center text-gray-500">
                                <svg class="mx-auto h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 mb-1 sm:mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-xs">No Image</span>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-gray-200">
                    <div className="text-center text-gray-500">
                      <svg className="mx-auto h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 mb-1 sm:mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">No Image</span>
                    </div>
                  </div>
                )}
                
                {/* Stock Badge Overlay */}
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                  {product.stock > 0 ? (
                    <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm">
                      {product.stock}
                    </span>
                  ) : (
                    <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm">
                      Habis
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-2 sm:p-3 lg:p-4">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 capitalize">
                    {product.category}
                  </p>
                  
                  <div className="pt-0.5 sm:pt-1">
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreProducts && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <span className="flex items-center">
              {showAll ? (
                <>
                  <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  Lihat Lebih Sedikit
                </>
              ) : (
                <>
                  Lihat Produk Lainnya
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </span>
            
            {/* Button shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-pulse"></div>
          </button>
        </div>
      )}

      {/* Products Counter */}
      {products.length > 0 && (
        <div className="text-center mt-6 text-sm text-gray-500">
          Menampilkan {displayedProducts.length} dari {products.length} produk
        </div>
      )}
    </div>
  );
}