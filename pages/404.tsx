// pages/404.tsx
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">
        Halaman yang kamu cari tidak ditemukan.
      </p>
      <Link href="/">
        <p className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Kembali ke Beranda
        </p>
      </Link>
    </div>
  );
}
