"use client";

import { useEffect, useState } from "react";
import { 
  Award, 
  Users, 
  Target, 
  Heart, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Shield,
  Clock,
  Globe,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

interface Stats {
  customers: number;
  products: number;
  years: number;
  satisfaction: number;
}

interface TeamMember {
  name: string;
  position: string;
  image: string;
  description: string;
}

interface CompanyValue {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

// Interface baru untuk Review
interface Review {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  user?: {
    name?: string;
  } | null;
}

const AboutJaxel: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    customers: 0,
    products: 0,
    years: 0,
    satisfaction: 0
  });

  // State untuk review
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Animate numbers
    const animateNumbers = (): void => {
      const targets: Stats = { customers: 15000, products: 500, years: 5, satisfaction: 98 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let current: Stats = { customers: 0, products: 0, years: 0, satisfaction: 0 };
      
      const timer = setInterval(() => {
        (Object.keys(targets) as Array<keyof Stats>).forEach((key) => {
          if (current[key] < targets[key]) {
            current[key] = Math.min(current[key] + Math.ceil(targets[key] / steps), targets[key]);
          }
        });
        
        setStats({ ...current });
        
        if ((Object.keys(targets) as Array<keyof Stats>).every((key) => current[key] >= targets[key])) {
          clearInterval(timer);
        }
      }, increment);
    };

    const timer = setTimeout(animateNumbers, 1000);

    // Fetch reviews
    fetch('http://localhost:3001/api/review/companys')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat ulasan');
        return res.json();
      })
      .then(data => {
        setReviews(data);
        setLoadingReviews(false);
      })
      .catch(err => {
        setErrorReviews(err.message);
        setLoadingReviews(false);
      });

    return () => clearTimeout(timer);
  }, []);

  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Johnson",
      position: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      description: "Visioner di balik JAXEL dengan 10+ tahun pengalaman di industri fashion."
    },
    {
      name: "Michael Chen",
      position: "Head of Design",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Desainer kreatif yang menciptakan koleksi fashion inovatif dan trendy."
    },
    {
      name: "Emily Rodriguez",
      position: "Marketing Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Ahli strategi pemasaran yang membangun brand JAXEL menjadi terkenal."
    },
    {
      name: "David Kim",
      position: "Operations Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Memastikan kualitas produk dan kepuasan pelanggan di setiap transaksi."
    }
  ];

  const values: CompanyValue[] = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Kualitas Premium",
      description: "Kami berkomitmen menyediakan produk fashion berkualitas tinggi dengan bahan terbaik dan finishing yang sempurna."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Focused",
      description: "Kepuasan pelanggan adalah prioritas utama kami. Kami mendengarkan feedback dan terus berinovasi."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Inovasi Berkelanjutan",
      description: "Selalu mengikuti tren terkini dan menciptakan desain-desain baru yang fresh dan modern."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion for Fashion",
      description: "Fashion adalah passion kami. Setiap produk dibuat dengan cinta dan dedikasi tinggi."
    }
  ];

  const milestones: Milestone[] = [
    {
      year: "2019",
      title: "Berdirinya JAXEL",
      description: "Memulai perjalanan dengan visi menjadi brand fashion terdepan di Indonesia."
    },
    {
      year: "2020",
      title: "Ekspansi Online",
      description: "Meluncurkan platform e-commerce dan mencapai 1000+ pelanggan pertama."
    },
    {
      year: "2021",
      title: "Koleksi Signature",
      description: "Meluncurkan koleksi signature yang menjadi best seller hingga kini."
    },
    {
      year: "2022",
      title: "Partnership Program",
      description: "Memulai program reseller dan dropshipper yang sukses besar."
    },
    {
      year: "2023",
      title: "Award Recognition",
      description: "Meraih penghargaan 'Best Fashion Brand' dari Indonesia Fashion Week."
    },
    {
      year: "2024",
      title: "Sustainable Fashion",
      description: "Meluncurkan lini produk ramah lingkungan dan berkelanjutan."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            data-aos="fade-down"
          >
            Tentang JAXEL
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-200"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Perjalanan kami dalam menciptakan fashion berkualitas tinggi yang menginspirasi 
            dan memberdayakan setiap individu untuk mengekspresikan gaya unik mereka.
          </p>
          <div className="flex justify-center" data-aos="zoom-in" data-aos-delay="400">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
              <ShoppingBag className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="0">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stats.customers.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stats.products}+
              </div>
              <div className="text-gray-600 font-medium">Premium Products</div>
            </div>
            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stats.years}
              </div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stats.satisfaction}%
              </div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Visi & Misi Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              Membangun masa depan fashion yang berkelanjutan dan inklusif
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8" data-aos="fade-right">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white p-3 rounded-full mr-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Visi Kami</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Menjadi brand fashion terdepan di Asia Tenggara yang dikenal karena 
                kualitas premium, desain inovatif, dan komitmen terhadap keberlanjutan 
                lingkungan. Kami ingin menginspirasi setiap individu untuk percaya diri 
                mengekspresikan kepribadian unik mereka melalui fashion.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8" data-aos="fade-left">
              <div className="flex items-center mb-6">
                <div className="bg-purple-600 text-white p-3 rounded-full mr-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Misi Kami</h3>
              </div>
              <ul className="text-gray-700 space-y-3 text-lg">
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                  Menyediakan produk fashion berkualitas tinggi dengan harga terjangkau
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                  Menciptakan pengalaman berbelanja yang luar biasa bagi setiap pelanggan
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                  Mengembangkan komunitas fashion yang positif dan supportif
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                  Berkontribusi pada industri fashion yang berkelanjutan
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Nilai-Nilai Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              Prinsip-prinsip yang menjadi fondasi dalam setiap langkah perjalanan JAXEL
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Perjalanan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              Milestone penting dalam perjalanan JAXEL menuju kesuksesan
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={index * 100}
              >
                <div className="w-1/2 pr-8 pl-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-blue-600 font-bold text-lg mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Tim Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              Orang-orang hebat di balik kesuksesan JAXEL
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <div className="text-blue-600 font-medium mb-3">
                    {member.position}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mengapa Memilih JAXEL? Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Mengapa Memilih JAXEL?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              JAXEL adalah pilihan tepat untuk fashion yang berkualitas dan inovatif.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition-shadow duration-300" data-aos="fade-up" data-aos-delay="0">
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Produk Berkualitas</h3>
              <p className="text-gray-700 leading-relaxed">
                Kami hanya menggunakan bahan terbaik dengan proses produksi yang ketat untuk memastikan setiap produk tahan lama dan nyaman digunakan.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition-shadow duration-300" data-aos="fade-up" data-aos-delay="100">
              <Clock className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Pengiriman Cepat</h3>
              <p className="text-gray-700 leading-relaxed">
                Layanan pengiriman yang cepat dan tepat waktu untuk memastikan pesanan Anda sampai dengan aman dan segera.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition-shadow duration-300" data-aos="fade-up" data-aos-delay="200">
              <Heart className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3">Layanan Pelanggan</h3>
              <p className="text-gray-700 leading-relaxed">
                Tim customer service kami siap membantu Anda dengan ramah dan profesional untuk setiap kebutuhan dan pertanyaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === TAMBAHAN: Review Section === */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Ulasan Pelanggan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              Lihat apa kata pelanggan kami tentang produk dan layanan JAXEL
            </p>
          </div>

          {loadingReviews && <p className="text-center text-gray-600">Memuat ulasan...</p>}
          {errorReviews && <p className="text-center text-red-600">Error: {errorReviews}</p>}

          {!loadingReviews && !errorReviews && (
            <>
              {reviews.length === 0 ? (
                <p className="text-center text-gray-600">Belum ada ulasan.</p>
              ) : (
                <ul className="space-y-8">
                  {reviews.map((review) => (
                    <li 
                      key={review.id} 
                      className="bg-white rounded-xl shadow p-6 border border-gray-200"
                      data-aos="fade-up"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {review.user?.name || "User Anonim"}
                        </h3>
                        <span className="text-yellow-500 font-bold">
                          {"⭐".repeat(review.rating)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.content}</p>
                      <time className="text-gray-400 text-sm">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-24 items-center justify-between">
          <div className="max-w-md" data-aos="fade-right">
            <h2 className="text-4xl font-bold mb-6">Hubungi Kami</h2>
            <p className="mb-8 text-gray-300 leading-relaxed">
              Ada pertanyaan? Kami siap membantu Anda.
            </p>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6" />
                <a href="tel:+6281234567890" className="hover:text-blue-400 transition">
                  +62 812-3456-7890
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6" />
                <a href="mailto:contact@jaxel.com" className="hover:text-blue-400 transition">
                  contact@jaxel.com
                </a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6" />
                <address className="not-italic hover:text-blue-400 transition">
                  Jl. Sudirman No.123, Jakarta, Indonesia
                </address>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2" data-aos="fade-left">
            <iframe
              title="JAXEL Location"
              className="w-full h-64 rounded-xl border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.2363707382337!2d106.82293187501974!3d-6.230684360282453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5f9eaeaf6ab%3A0x24ee191eaa320ecb!2sJl.%20Jenderal%20Sudirman%20No.123%2C%20RT.5%2FRW.2%2C%20Karet%20Sesia%2C%20Setiabudi%2C%20Jakarta%20Selatan%20City%2C%20Jakarta%2012910%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1691304669963!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutJaxel;
