'use client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const Services = () => {
  const router = useRouter();

  const layanan = [
    {
      title: "Penjualan Baju",
      description: "Kami menyediakan layanan penjualan baju berkualitas dengan berbagai pilihan model dan ukuran.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: "/penjualan-baju",
    },
    {
      title: "Marketing Baju",
      description: "Kami membantu memasarkan produk baju Anda melalui strategi digital yang efektif.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Desain Custom",
      description: "Tersedia layanan desain baju custom sesuai permintaan Anda.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
    },
    {
      title: "Pembuatan website",
      description: "membuat website praktis dengan bantuan Jaxel",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
            link: "/web"
    },
  ];


const handleClick = (link?: string) => {
  if (link) {
    router.push(link);
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Layanan Belum Tersedia',
      text: 'Mohon maaf, layanan ini masih dalam pengembangan.',
      confirmButtonColor: '#3b82f6', // warna biru
    });
  }
};

  return (
    <section className="bg-white py-24 px-4 md:px-16" id="layanan-kami">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Layanan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Solusi komprehensif untuk mengembangkan bisnis fashion Anda dengan pendekatan profesional dan hasil yang terukur.
          </p>
        </div>
        
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {layanan.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.link)}
              className={`group bg-white rounded-lg p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg ${
                item.link ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg mb-6 group-hover:bg-blue-100 transition-colors">
                <div className="text-blue-600">
                  {item.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-base">
                {item.description}
              </p>
              
              {item.link && (
                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  <span className="text-sm">Pelajari lebih lanjut</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;