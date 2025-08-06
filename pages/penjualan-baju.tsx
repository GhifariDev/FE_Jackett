'use client';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/router';
import FormInput from './components/elements/FromInput';
import FormTextarea from './components/elements/FromTextArea';
import ImageGallery from './components/fragments/ImageGalery';

const PenjualanBajuPage = () => {
    
const router = useRouter();

  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    alasan: '',
    gambar: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, gambar: file }));
  };

const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

 const userEmail = Cookies.get('user_email'); // kamu bisa pakai js-cookie atau cara lain

  if (!userEmail) {
    alert('Silakan login terlebih dahulu sebelum mengisi form.');
    router.push('/login'); // arahkan ke halaman login
    return;
  }

  const formPayload = new FormData();
  formPayload.append('nama', formData.nama);
  formPayload.append('alamat', formData.alamat);
  formPayload.append('alasan', formData.alasan);
  if (formData.gambar) {
    formPayload.append('gambar', formData.gambar);
  }

  try {
   const response = await fetch('http://localhost:3001/api/penjualan-baju', {
      method: 'POST',
      body: formPayload,
      credentials: 'include', // ← penting kalau pakai cookie
    });

    const result = await response.json();
    alert(result.message || 'Form berhasil dikirim!');
  } catch (error) {
    console.error('Error submit form:', error);
    alert('Terjadi kesalahan saat mengirim form.');
  }
};


  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl w-full lg:w-2/3 p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-black text-center">Form Penjualan Baju</h2>
          <FormInput label="Nama" name="nama" value={formData.nama} onChange={handleChange} />
          <FormInput label="Alamat" name="alamat" value={formData.alamat} onChange={handleChange} />
          <div>
            <label className="block text-black font-medium mb-1">Upload Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full border border-black rounded-md p-2"
            />
          </div>
          <FormTextarea label="Alasan Penjualan" name="alasan" value={formData.alasan} onChange={handleChange} />
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md font-semibold transition"
          >
            Kirim Formulir
          </button>
        </form>

        <div className="bg-white shadow-md rounded-2xl w-full lg:w-1/3 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">Ketentuan Baju Layak Jual</h3>
            <ul className="list-disc list-inside text-black space-y-2 text-sm">
              <li>Baju dalam kondisi bersih dan tidak robek.</li>
              <li>Tidak terdapat noda permanen.</li>
              <li>Masih layak pakai dan tidak usang.</li>
              <li>Label ukuran dan merek masih terbaca.</li>
              <li>Bukan pakaian dalam atau sejenisnya.</li>
              <li>Sudah dicuci sebelum dikirim.</li>
            </ul>
          </div>
          <ImageGallery />
        </div>
      </div>
    </div>
  );
};

export default PenjualanBajuPage;
