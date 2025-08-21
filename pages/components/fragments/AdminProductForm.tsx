"use client";

import { useState, useEffect, useRef } from "react";

interface ProductFormProps {
  product?: any;
  onSubmitSuccess?: () => void;
}

export default function AdminProductForm({ product, onSubmitSuccess }: ProductFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Use ref to track last processed product ID to prevent infinite loops
  const lastProductIdRef = useRef<number | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Helper functions for image URL handling
  const getImageUrls = (imageUrl: string) => {
    if (!imageUrl) return [];
    
    try {
      const imageArray = JSON.parse(imageUrl);
      return Array.isArray(imageArray) ? imageArray : [imageUrl];
    } catch (error) {
      return [imageUrl];
    }
  };

  const getImagePath = (filename: string, sellerName?: string) => {
    if (!filename) return '';
    
    if (sellerName) {
      // Format: uploads/products/seller_name/filename
      const folderName = sellerName.toLowerCase().replace(/\s+/g, '_');
      return `${API_URL}/uploads/products/${folderName}/${filename}`;
    }
    
    return `${API_URL}/uploads/${filename}`;
  };

  // Update form when product prop changes - dengan protection dari loop
  useEffect(() => {
    // Cek apakah product benar-benar berubah
    const productId = product?.id || null;
    
    if (productId === lastProductIdRef.current && product) {
      // Product sama, skip update
      return;
    }
    
    lastProductIdRef.current = productId;

    if (product) {
      console.log('Updating form with product:', product);
      
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
      });
      
      // Handle multiple existing images
      if (product.imageUrl) {
        const sellerName = product.seller?.name || product.seller?.nama || product.sellerName;
        console.log('Processing images for seller:', sellerName);
        
        try {
          const imageArray = getImageUrls(product.imageUrl);
          console.log('Parsed image array:', imageArray);
          
          if (imageArray.length > 0) {
            const imageUrls = imageArray.map((filename: string) => 
              getImagePath(filename, sellerName)
            );
            
            console.log('Generated image URLs:', imageUrls);
            setExistingImages(imageUrls);
            setImagePreview(imageUrls[0]);
          } else {
            setExistingImages([]);
            setImagePreview(null);
          }
        } catch (error) {
          console.error('Error processing images:', error);
          setExistingImages([]);
          setImagePreview(null);
        }
      } else {
        setExistingImages([]);
        setImagePreview(null);
      }
    } else {
      // Reset form for new product
      console.log('Resetting form for new product');
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
      setExistingImages([]);
      setImagePreview(null);
    }
    
    // Always reset new image selection when product changes
    setImage(null);
  }, [product?.id, API_URL]); // Hanya depend on product.id, bukan seluruh product object

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    // Create preview URL for new image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append("image", image);

      const url = product
        ? `${API_URL}/api/admin-products/${product.id}`
        : `${API_URL}/api/admin-products/create`;

      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        alert("Berhasil!");
        
        if (!product) {
          // Reset form only for new products
          setForm({
            title: "",
            description: "",
            price: "",
            category: "",
            stock: "",
          });
          setImage(null);
          setImagePreview(null);
          setExistingImages([]);
          lastProductIdRef.current = null;
        }
        
        onSubmitSuccess?.();
      } else {
        const errorData = await res.json();
        alert(`Gagal: ${errorData.message || 'Terjadi kesalahan'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengirim data");
    } finally {
      setLoading(false);
    }
  };

  // Component untuk menampilkan existing images
  const ExistingImages = () => {
    if (existingImages.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            Gambar Saat Ini ({existingImages.length} gambar):
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {existingImages.map((imageUrl, index) => (
            <div key={`${product?.id}-${index}`} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Fallback ke SVG placeholder
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMS4zMzMzIDIxLjMzMzNIMTZWNDIuNjY2N0g0OFYyMS4zMzMzSDQyLjY2NjdMMzkuOTk5OSAxOC42NjY3SDI0TDIxLjMzMzMgMjEuMzMzM1oiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                    console.error('Image failed to load:', imageUrl);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', imageUrl);
                  }}
                />
              </div>
              
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full font-medium">
                {index + 1}
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="truncate">
                  {imageUrl.split('/').pop() || `Image ${index + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 italic">
          Pilih gambar baru untuk mengganti yang ada
        </p>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan nama produk"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Harga <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-sm">Rp</span>
              <input
                type="number" 
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Pilih Kategori</option>
              <option value="Jaket">Jaket</option>
              <option value="Fashion">Fashion</option>
              <option value="Tas">Tas</option>
              <option value="Sandal">Sandal</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Aksesoris">Aksesoris</option>
              <option value="Sepatu">Sepatu</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stok
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Jumlah stok"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi produk"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk
            </label>
            <div className="space-y-3">
              <ExistingImages />
              
              {/* New Image Preview */}
              {imagePreview && !existingImages.includes(imagePreview) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Preview Gambar Baru:</p>
                  <div className="w-full h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="New image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* File Input */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        {product ? "Klik untuk ganti gambar" : "Klik untuk upload"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {product ? "Update Produk" : "Tambah Produk"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}