'use client';

import { useRouter } from 'next/navigation';

const Services = () => {
  const router = useRouter();

  const layanan = [
    {
      title: "Penjualan Baju",
      description: "Kami menyediakan layanan penjualan baju berkualitas dengan berbagai pilihan model dan ukuran.",
      icon: "🛍️",
      link: "/penjualan-baju",
    },
    {
      title: "Marketing Baju",
      description: "Kami membantu memasarkan produk baju Anda melalui strategi digital yang efektif.",
      icon: "📈",
    },
    {
      title: "Desain Custom",
      description: "Tersedia layanan desain baju custom sesuai permintaan Anda.",
      icon: "🎨",
    },
    {
      title: "Dropship & Reseller",
      description: "Bergabunglah sebagai dropshipper atau reseller untuk penghasilan tambahan.",
      icon: "🤝",
    },
  ];

  const handleClick = (link?: string) => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <section className="bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4 md:px-16" id="layanan-kami">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Layanan Kami</h2>
        <p className="text-gray-400 mb-14 max-w-2xl mx-auto text-base">
          Kami menyediakan berbagai layanan untuk mendukung bisnis fashion Anda secara menyeluruh.
        </p>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {layanan.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.link)}
              className="group bg-gray-800/70 backdrop-blur rounded-2xl p-6 hover:bg-gray-700/80 transition-all duration-300 border border-gray-700 hover:shadow-xl cursor-pointer"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">{item.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
