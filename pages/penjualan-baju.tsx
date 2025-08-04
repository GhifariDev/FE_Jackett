'use client';

import { useState } from 'react';

const PenjualanBaju = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert('Form penjualan baju berhasil dikirim!');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl w-full lg:w-2/3 p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-green-700 text-center">Form Penjualan Baju</h2>

          <div>
            <label className="block text-green-800 font-medium mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-green-800 font-medium mb-1">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-green-800 font-medium mb-1">Upload Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full border border-green-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-green-800 font-medium mb-1">Alasan Penjualan</label>
            <textarea
              name="alasan"
              value={formData.alasan}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition"
          >
            Kirim Formulir
          </button>
        </form>

        {/* Rules + Contoh Baju */}
        <div className="bg-white shadow-md rounded-2xl w-full lg:w-1/3 p-6 space-y-6">
          {/* RULES */}
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-4">Ketentuan Baju Layak Jual</h3>
            <ul className="list-disc list-inside text-green-800 space-y-2 text-sm">
              <li>Baju dalam kondisi bersih dan tidak robek.</li>
              <li>Tidak terdapat noda permanen.</li>
              <li>Masih layak pakai dan tidak usang.</li>
              <li>Label ukuran dan merek masih terbaca.</li>
              <li>Bukan pakaian dalam atau sejenisnya.</li>
              <li>Sudah dicuci sebelum dikirim.</li>
            </ul>
          </div>

          {/* CONTOH BAJU */}
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-3">Contoh Baju Pernah Dijual</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: '/baju1.jpg', caption: 'Kemeja Polos' },
                { src: '/baju2.jpg', caption: 'Kaos Branded' },
                { src: '/baju3.jpg', caption: 'Hoodie Bekas' },
                { src: '/baju4.jpg', caption: 'Blouse Wanita' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-32 object-cover rounded-lg border border-green-200"
                  />
                  <p className="text-xs text-green-800 mt-1">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenjualanBaju;
