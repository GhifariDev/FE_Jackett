'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { 
  Upload,
  User,
  MapPin,
  MessageSquare,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Star,
  Camera,
  X,
  Package,
  DollarSign,
  Hash,
  Ruler,
  Weight
} from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import komponen
import ImageGallery from './components/fragments/ImageGalery';

interface FormData {
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  weight: string;
  dimensions: string;
  nama: string;
  alamat: string;
  alasan: string;
  gambar: File[];
}

const categories = [
  'Pakaian Pria',
  'Pakaian Wanita',
  'Pakaian Anak',
  'Aksesoris',
  'Sepatu',
  'Tas',
  'Lainnya'
];

const PenjualanBajuPage = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    weight: '',
    dimensions: '',
    nama: '',
    alamat: '',
    alasan: '',
    gambar: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isDragActive, setIsDragActive] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });
  }, []);

  // Ambil role user dari backend
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_URL}/api/me`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.role) {
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      } catch (err) {
        console.error('Gagal ambil role user:', err);
        setUserRole(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserRole();
  }, [API_URL]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    // Product fields validation
    if (!formData.title.trim()) newErrors.title = 'Judul produk harus diisi';
    else if (formData.title.length < 5) newErrors.title = 'Judul minimal 5 karakter';

    if (!formData.description.trim()) newErrors.description = 'Deskripsi harus diisi';
    else if (formData.description.length < 20) newErrors.description = 'Deskripsi minimal 20 karakter';

    if (!formData.category) newErrors.category = 'Kategori harus dipilih';

    if (!formData.price.trim()) newErrors.price = 'Harga harus diisi';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Harga harus berupa angka positif';
    }

    if (!formData.stock.trim()) newErrors.stock = 'Stok harus diisi';
    else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stok harus berupa angka non-negatif';
    }

    // Optional weight validation
    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0)) {
      newErrors.weight = 'Berat harus berupa angka positif';
    }

    // Personal info validation
    if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
    else if (formData.nama.length < 3) newErrors.nama = 'Nama minimal 3 karakter';

    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat harus diisi';
    else if (formData.alamat.length < 10) newErrors.alamat = 'Alamat minimal 10 karakter';

    if (!formData.alasan.trim()) newErrors.alasan = 'Alasan penjualan harus diisi';
    else if (formData.alasan.length < 20) newErrors.alasan = 'Alasan minimal 20 karakter';

    if (formData.gambar.length < 3) newErrors.gambar = 'Minimal 3 gambar harus diupload' as any;
    else if (formData.gambar.length > 5) newErrors.gambar = 'Maksimal 5 gambar dapat diupload' as any;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFiles = 5;

    // Check if adding these files would exceed the limit
    const currentCount = formData.gambar.length;
    const newFilesCount = files.length;
    
    if (currentCount + newFilesCount > maxFiles) {
      Swal.fire({ icon: 'error', title: 'Terlalu Banyak File', text: `Maksimal ${maxFiles} gambar. Anda sudah memiliki ${currentCount} gambar.` });
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        Swal.fire({ icon: 'error', title: 'File Terlalu Besar', text: `File ${file.name} melebihi 5MB` });
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({ icon: 'error', title: 'Format Tidak Valid', text: `File ${file.name} bukan JPG, JPEG, atau PNG` });
        return;
      }

      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviewImages(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        gambar: [...prev.gambar, ...validFiles] 
      }));
      if (errors.gambar) setErrors(prev => ({ ...prev, gambar: undefined }));
    }
  };

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFileChange(files);
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(false); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileChange(files);
  };

  const removeImage = (index: number) => { 
    setFormData(prev => ({
      ...prev,
      gambar: prev.gambar.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return Swal.fire({ icon: 'error', title: 'Form Tidak Valid', text: 'Periksa kembali data Anda' });

    if (loadingUser) return Swal.fire({ icon: 'info', title: 'Memeriksa akses...', text: 'Tunggu sebentar' });
    if (!userRole) return Swal.fire({ icon: 'error', title: 'Login Diperlukan', text: 'Silakan login terlebih dahulu' });
    if (!userRole?.includes('seller')) {
      return Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Hanya seller yang dapat mengisi form ini' });
    }

    const userEmail = Cookies.get('user_email');
    const token = Cookies.get('token');

    if (!userEmail || !token) {
      return Swal.fire({ icon: 'warning', title: 'Login Seller Diperlukan', text: 'Silakan login sebagai seller untuk mengakses fitur ini' }).then(() => router.push('/login-seller'));
    }

    setIsSubmitting(true);
    const formPayload = new FormData();
    
    // Product data
    formPayload.append('title', formData.title.trim());
    formPayload.append('description', formData.description.trim());
    formPayload.append('category', formData.category);
    formPayload.append('price', formData.price);
    formPayload.append('stock', formData.stock);
    if (formData.weight) formPayload.append('weight', formData.weight);
    if (formData.dimensions) formPayload.append('dimensions', formData.dimensions.trim());
    
    // Personal data (for tracking/contact)
    formPayload.append('nama', formData.nama.trim());
    formPayload.append('alamat', formData.alamat.trim());
    formPayload.append('alasan', formData.alasan.trim());
    formPayload.append('email', userEmail);
    
    // Image
    if (formData.gambar.length > 0) {
      formData.gambar.forEach((file, index) => {
        formPayload.append('images', file);
      });
      // Create imageUrl array for backend
      const imageUrls = formData.gambar.map(file => file.name);
      formPayload.append('imageUrl', JSON.stringify(imageUrls));
    }

    try {
      const response = await fetch(`${API_URL}/api/seller/products`, {
        method: 'POST',
        body: formPayload,
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: result.message || 'Produk berhasil diajukan untuk review.' });
        // Reset form
        setFormData({ 
          title: '', description: '', category: '', price: '', stock: '', weight: '', dimensions: '',
          nama: '', alamat: '', alasan: '', gambar: [] 
        });
        setPreviewImages([]);
        setErrors({});
      } else throw new Error(result.message || 'Gagal mengirim produk');
    } catch (error: any) {
      console.error('Error submit form:', error);
      Swal.fire({ icon: 'error', title: 'Gagal Mengirim Produk', text: error.message || 'Terjadi kesalahan saat mengirim produk.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirements = [
    'Produk dalam kondisi bersih dan tidak rusak',
    'Foto produk harus jelas dari berbagai sudut',
    'Deskripsi produk harus detail dan akurat',
    'Harga harus wajar dan kompetitif',
    'Stok harus sesuai dengan ketersediaan aktual',
    'Kategori produk harus tepat dan sesuai',
  ];

  const benefits = [
    'Platform terpercaya untuk menjual produk fashion',
    'Proses verifikasi yang cepat dan transparan',
    'Komisi kompetitif untuk setiap penjualan',
    'Dukungan marketing dan promosi produk',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Jual Produk Fashion Anda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Daftarkan produk fashion Anda di platform kami! Kami memberikan kesempatan terbaik untuk menjual produk berkualitas dengan proses yang mudah dan terpercaya.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-700 font-medium">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1" data-aos="fade-right">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Form Pendaftaran Produk</h2>
              </div>

              {/* Product Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Informasi Produk
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title Field */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-gray-700 font-medium">Judul Produk</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Masukkan judul produk yang menarik"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Category Field */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">Kategori</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.category ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Price Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <DollarSign className="w-4 h-4" />
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.price ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Stock Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Hash className="w-4 h-4" />
                      Stok
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.stock ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.stock}
                      </p>
                    )}
                  </div>

                  {/* Weight Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Weight className="w-4 h-4" />
                      Berat (kg) <span className="text-gray-500 text-sm">(opsional)</span>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0.5"
                      step="0.1"
                      min="0"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.weight ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.weight}
                      </p>
                    )}
                  </div>

                  {/* Dimensions Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Ruler className="w-4 h-4" />
                      Dimensi <span className="text-gray-500 text-sm">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="P x L x T (cm)"
                      className="w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors border-gray-200"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <MessageSquare className="w-4 h-4" />
                      Deskripsi Produk
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Deskripsikan produk secara detail (bahan, ukuran, kondisi, dll)"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none ${
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        {errors.description && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.description}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formData.description.length}/1000 karakter
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informasi Penjual
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Field */}
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap Anda"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.nama ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.nama && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.nama}
                      </p>
                    )}
                  </div>

                  {/* Alamat Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <MapPin className="w-4 h-4" />
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap dengan kode pos"
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                        errors.alamat ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.alamat && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.alamat}
                      </p>
                    )}
                  </div>
                </div>

                {/* Alasan Field */}
                <div className="space-y-2 mt-4">
                  <label className="text-gray-700 font-medium">Alasan Bergabung / Motivasi Menjual</label>
                  <textarea
                    name="alasan"
                    value={formData.alasan}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ceritakan motivasi Anda untuk menjual di platform kami"
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none ${
                      errors.alasan ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      {errors.alasan && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.alasan}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formData.alasan.length}/500 karakter
                    </p>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Camera className="w-4 h-4" />
                  Upload Gambar Produk (Minimal 3, Maksimal 5)
                </label>
                
                {/* Upload Area */}
                <div
                  className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : errors.gambar 
                      ? 'border-red-500' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    Drag & drop gambar di sini, atau <span className="text-blue-600 font-medium">klik untuk browse</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Format: JPG, JPEG, PNG (Max. 5MB per file)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Gambar saat ini: {formData.gambar.length}/5 • Minimal 3 gambar diperlukan
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleInputFileChange}
                    className="hidden"
                  />
                </div>

                {/* Preview Images */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.gambar && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                  </p>
                )}

                {/* Upload Tips */}
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    <strong>Tips Foto Produk:</strong>
                  </p>
                  <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                    <li>• Foto utama: tampilan depan produk dengan pencahayaan baik</li>
                    <li>• Foto detail: close-up bahan, label, atau detail penting</li>
                    <li>• Foto samping/belakang: tunjukkan kondisi dari berbagai sudut</li>
                    <li>• Hindari foto blur atau dengan background yang berantakan</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim Produk...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Daftar Produk
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="w-full xl:w-96 space-y-8" data-aos="fade-left">
            {/* Requirements Card */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Ketentuan Produk</h3>
              </div>
              
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{requirement}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  💡 Tips: Produk yang disetujui akan langsung tayang di marketplace dengan sistem komisi yang menguntungkan!
                </p>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Galeri Inspirasi</h3>
              <ImageGallery />
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Butuh Bantuan?</h3>
              <p className="text-blue-100 mb-4">
                Tim seller support kami siap membantu Anda 24/7
              </p>
              <div className="space-y-2 text-sm">
                <p>📞 WhatsApp: +62 812-3456-7890</p>
                <p>✉️ Email: seller@fashionstore.com</p>
                <p>⏰ Jam Operasional: 08:00 - 22:00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenjualanBajuPage;