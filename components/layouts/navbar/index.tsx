'use client';

import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from "lucide-react";
import CartDrawer from '../../fragments/CartDrawer';
import Swal from 'sweetalert2';
import Link from "next/link";

type User = {
  name: string;
  role: string;
  sellerRequestStatus?: 'pending' | 'approved' | 'rejected';
};

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); 
  const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  const items = useCartStore(state => state.items);
  const totalQty: number = items.length;

  const handleLogout = async (): Promise<void> => {
    try {
      if (!API_URL) throw new Error("API_URL tidak ditemukan");
      await fetch(`${API_URL}/api/logout`, { method: 'POST', credentials: 'include' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  const toggleMenu = (): void => setIsMenuOpen(prev => !prev);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      if (!API_URL) return;
      const res = await fetch(`${API_URL}/api/me`, { credentials: 'include' });
      if (!res.ok) throw new Error("Gagal fetch user");
      const data: User = await res.json();
      setUser(data);

      // Cek apakah alert sudah ditampilkan
      const approvedShown = sessionStorage.getItem('sellerApprovedShown');

      // Hanya web (bisa pakai navigator.userAgent atau window)
      const isWeb = typeof window !== 'undefined';

      if (isWeb && data.sellerRequestStatus === 'approved' && !approvedShown) {
        Swal.fire({
          icon: 'success',
          title: 'Selamat!',
          text: 'Akun Anda sudah disetujui sebagai seller oleh admin',
          timer: 3000,
          showConfirmButton: false,
        });
        sessionStorage.setItem('sellerApprovedShown', 'true'); // tandai sudah ditampilkan
      } else if (isWeb && data.sellerRequestStatus === 'rejected' && !approvedShown) {
        Swal.fire({
          icon: 'error',
          title: 'Maaf',
          text: 'Request seller Anda ditolak oleh admin',
          timer: 3000,
          showConfirmButton: false,
        });
        sessionStorage.setItem('sellerApprovedShown', 'true'); // agar alert tidak muncul lagi
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, [API_URL]);



  return (
    <>
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
              <span className="font-bold text-gray-800 text-lg">JAXEL</span>
            </div>

            {/* Menu desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">HOME</a>
              <a href="/products" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">PRODUCTS</a>
              <a href="/product-discount" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">PRODUCTS DISCOUNT</a>
              <a href="/aboutJaxel" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">ABOUT JAXEL</a>
              <a href="/review-kami" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">REVIEW KAMI</a>
            </div>

            {/* Right side desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Cart icon with badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-green-700 transition-colors"
                aria-label="Keranjang"
              >
                <FaShoppingCart size={20} />
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-2 rounded-full">
                    {totalQty}
                  </span>
                )}
              </button>

              {/* Admin Dashboard Link */}
              {user?.role === "admin" && (
                <a href="/AdminPage" className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors">
                  Admin Dashboard
                </a>
              )}

              {/* Seller Approved Badge */}
              {/* {user?.sellerRequestStatus === 'approved' && (
                <span className="bg-green-500 text-white px-2 py-1 rounded">Seller Approved</span>
              )} */}

              {/* User info / Login */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-green-700 transition-colors">
                    <FaUserCircle size={20} />
                    <span className="text-sm">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      type="button"
                    >
                      Logout
                    </button>
                    <Link href="/profile" className="block w-full text-left py-2 text-sm text-black hover:text-slate-500 hover:bg-red-50 rounded px-2 transition-colors">Jadi Seller</Link>
                  </div>
                </div>
              ) : (
                <a href="/login" className="text-sm text-gray-700 hover:text-green-700 transition-colors">
                  Login
                </a>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 focus:outline-none hover:text-green-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
            <a href="/" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">HOME</a>
            <a href="/products" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">PRODUCTS</a>
            <a href="/product-discount" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">PRODUCTS DISCOUNT</a>
            <a href="/aboutJaxel" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">ABOUT JAXEL</a>
            <a href="/review-kami" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">REVIEW KAMI</a>

            {user?.role === "admin" && (
              <a href="/AdminPage" className="block py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded px-2 transition-colors">
                Admin Dashboard
              </a>
            )}

            {/* Seller Approved Badge mobile */}
            {user?.sellerRequestStatus === 'approved' && (
              <span className="inline-block bg-green-500 text-white px-2 py-1 rounded">Seller Approved</span>
            )}

            {/* Cart icon mobile */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 text-gray-700 hover:text-green-700"
              aria-label="Keranjang"
            >
              <ShoppingCart size={24} />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-300 text-xs px-2 rounded-full">
                  {totalQty}
                </span>
              )}
              Keranjang
            </button>

            <hr className="my-3 border-gray-200" />
            {user ? (
              <>
              
             
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded px-2 transition-colors"
                type="button"
              >
                Logout ({user.name})
              </button>
              <Link href="/profile" className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded px-2 transition-colors">Jadi Seller</Link>
               </>
            ) : (
              <a href="/login" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Drawer Cart */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
