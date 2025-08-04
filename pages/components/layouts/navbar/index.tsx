import { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
     const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-gray-800 text-lg">JAXEL</span>
          </div>

          {/* Middle: Navigation Links + Search */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm text-gray-700 hover:text-green-700 font-medium">HOME</a>
               <a href="/products" className="text-sm text-gray-700 hover:text-green-700 font-medium">PRODUCTS</a>
            <a href="#" className="text-sm text-gray-700 hover:text-green-700 font-medium">PRODUCTS DISCOUNT</a>
            <a href="#" className="text-sm text-gray-700 hover:text-green-700 font-medium">ABOUT JAXEL</a>
            <input
              type="text"
              placeholder="Search Our Products"
              className="px-3 py-1.5 border rounded-full text-sm w-64 focus:outline-none focus:ring focus:border-green-500"
            />
          </div>

          {/* Right: Cart + User */}
          <div className="flex items-center space-x-6">
            <a href="/cart" className="text-gray-700 hover:text-green-700">
              <FaShoppingCart size={20} />
            </a>

            {/* User Dropdown */}
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

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
  