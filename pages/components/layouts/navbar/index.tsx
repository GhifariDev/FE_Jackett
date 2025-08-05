'use client';

import { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    await fetch('http://localhost:3001/api/logout', {
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
            <a href="/" className="text-sm text-gray-700 hover:text-green-700 font-medium">HOME</a>
            <a href="/products" className="text-sm text-gray-700 hover:text-green-700 font-medium">PRODUCTS</a>
            <a href="#" className="text-sm text-gray-700 hover:text-green-700 font-medium">PRODUCTS DISCOUNT</a>
            <a href="/About-Jaxel" className="text-sm text-gray-700 hover:text-green-700 font-medium">ABOUT JAXEL</a>
            <input
              type="text"
              placeholder="Search Our Products"
              className="px-3 py-1.5 border rounded-full text-sm w-64 focus:outline-none focus:ring focus:border-green-500"
            />
          </div>

          {/* Right side: Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/cart" className="text-gray-700 hover:text-green-700">
              <FaShoppingCart size={20} />
            </a>

            {userName ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-700">
                  <FaUserCircle size={20} />
                  <span className="text-sm">{userName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md hidden group-hover:block z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <a href="/login" className="text-sm text-gray-700 hover:text-green-700">Login</a>
            )}
          </div>

          {/* Hamburger Button (Mobile) */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow">
          <a href="/" className="block text-sm text-gray-700 hover:text-green-700">HOME</a>
          <a href="/products" className="block text-sm text-gray-700 hover:text-green-700">PRODUCTS</a>
          <a href="#" className="block text-sm text-gray-700 hover:text-green-700">PRODUCTS DISCOUNT</a>
          <a href="/About-Jaxel" className="block text-sm text-gray-700 hover:text-green-700">ABOUT JAXEL</a>

          <hr className="my-2 border-gray-200" />
          <a href="/cart" className="block text-sm text-gray-700 hover:text-green-700">CART</a>
          {userName ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="block text-sm text-gray-700 hover:text-green-700">Login</a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
