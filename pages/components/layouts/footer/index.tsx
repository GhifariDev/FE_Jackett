const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 shadow-inner">
     <div className="container mx-auto px-6 text-sm text-center md:text-left space-y-10">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Tentang Kami */}
    <div>
      <h4 className="text-base font-semibold mb-3">Tentang Kami</h4>
      <p className="text-gray-400 leading-relaxed">
        Jaxel Fulfillment adalah platform belanja terpercaya untuk berbagai kebutuhan fashion dan aksesoris Anda.
      </p>
    </div>

    {/* Navigasi */}
    <div>
      <h4 className="text-base font-semibold mb-3">Navigasi Cepat</h4>
      <ul className="space-y-2">
        <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
        <li><a href="/products" className="hover:text-green-400 transition">Produk</a></li>
        <li><a href="/login" className="hover:text-green-400 transition">Login</a></li>
        <li><a href="/register" className="hover:text-green-400 transition">Daftar</a></li>
      </ul>
    </div>

    {/* Kontak */}
    <div>
      <h4 className="text-base font-semibold mb-3">Kontak</h4>
      <p className="text-gray-400">Email: support@marketplace.com</p>
      <p className="text-gray-400">Telepon: +62 812 3456 7890</p>
      <div className="mt-4 flex justify-center md:justify-start gap-4">
        <a href="#" className="hover:text-blue-500">Facebook</a>
        <a href="#" className="hover:text-pink-400">Instagram</a>
        <a href="#" className="hover:text-sky-400">Twitter</a>
      </div>
    </div>
  </div>

  <div className="text-center text-xs text-gray-500 mt-10">
    © 2025 Market Place. All rights reserved.
  </div>
</div>

    </footer>
  );
};

export default Footer;
