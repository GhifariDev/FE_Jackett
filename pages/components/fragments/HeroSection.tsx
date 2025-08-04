"use client"

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 800, // animasi dalam milidetik
      once: true,    // hanya animasi sekali
    });
  }, []);

  return (
    <section
      className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/jaket.jpg')" }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
      >
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-[0_4px_10px_rgba(255,255,255,0.2)]"
          data-aos="fade-down-left"
        >
          WHAT’S NEW!
        </h1>

        <p
          className="text-orange-400 text-xl md:text-2xl mb-8 tracking-wide"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          View The Latest Styles
        </p>

        <div className="flex gap-4" data-aos="zoom-in" data-aos-delay="600">
          <a
            href="/products"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Shop Now
          </a>
          <a
            href="/About-Jaxel"
            className="bg-white hover:bg-gray-100 text-black font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            ABOUT JAXEL
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
