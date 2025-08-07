'use client';

import { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const totalItems = (useCartStore((state) => state.items) || []).reduce(
  (acc, item) => acc + item.quantity,
  0
);
  useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const name = getCookie("user_name");
    if (name) {
      setUserName(decodeURIComponent(name));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://feaea59b-29c1-410d-876c-82ef3311a0c5-00-2j44gkrr7d6ab.pike.replit.dev/api/logout', {
        method: 'POST',
        credentials: 'include', // ← WAJIB! agar cookie dikirim ke BE
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">HOME</a>
              <a href="/products" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">PRODUCTS</a>
              <a href="/product-discount" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">PRODUCTS DISCOUNT</a>
              <a href="/aboutJaxel" className="text-sm text-gray-700 hover:text-green-700 font-medium transition-colors">ABOUT JAXEL</a>
              <input
                type="text"
                placeholder="Search Our Products"
                className="px-3 py-1.5 border border-gray-300 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Right side: Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/cart" className="text-gray-700 hover:text-green-700 transition-colors">
                <FaShoppingCart size={20} />
              </a>

              {userName ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-green-700 transition-colors">
                    <FaUserCircle size={20} />
                    <span className="text-sm">{userName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <a href="/login" className="text-sm text-gray-700 hover:text-green-700 transition-colors">Login</a>
              )}
            </div>

            {/* Hamburger Button (Mobile) */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-700 focus:outline-none hover:text-green-700 transition-colors">
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
            <a href="/" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">HOME</a>
            <a href="/products" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">PRODUCTS</a>
            <a href="product-discount" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">PRODUCTS DISCOUNT</a>
            <a href="/aboutJaxel" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">ABOUT JAXEL</a>
            <a href="/riviewskami" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">KIRIM ULASAN *harus login </a>

            <div className="pt-2">
              <input
                type="text"
                placeholder="Search Our Products"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <hr className="my-3 border-gray-200" />
            <div className="relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            {userName ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded px-2 transition-colors"
              >
                Logout ({userName})
              </button>
            ) : (
              <a href="/login" className="block py-2 text-sm text-gray-700 hover:text-green-700 hover:bg-gray-50 rounded px-2 transition-colors">Login</a>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer untuk fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;