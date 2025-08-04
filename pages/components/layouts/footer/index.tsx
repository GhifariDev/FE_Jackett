const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-16 shadow-inner">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-center md:text-left">
        
        {/* Section 1: About */}
        <div>
          <h4 className="text-base font-semibold mb-2">Tentang Kami</h4>
          <p className="text-gray-400">
            Market Place adalah platform belanja terpercaya untuk berbagai kebutuhan fashion dan aksesoris Anda.
          </p>
        </div>

        {/* Section 2: Navigasi */}
        <div>
          <h4 className="text-base font-semibold mb-2">Navigasi Cepat</h4>
          <ul className="space-y-1">
            <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
            <li><a href="/products" className="hover:text-green-400 transition">Produk</a></li>
            <li><a href="/login" className="hover:text-green-400 transition">Login</a></li>
            <li><a href="/register" className="hover:text-green-400 transition">Daftar</a></li>
          </ul>
        </div>

        {/* Section 3: Kontak */}
        <div>
          <h4 className="text-base font-semibold mb-2">Kontak</h4>
          <p>Email: support@marketplace.com</p>
          <p>Telepon: +62 812 3456 7890</p>
          <div className="mt-2 flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-blue-500">Facebook</a>
            <a href="#" className="hover:text-pink-400">Instagram</a>
            <a href="#" className="hover:text-sky-400">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-gray-500">
        © 2025 Market Place. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
