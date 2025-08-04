const HeroSection = () => {
  return (
   <section
  className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/Jaket_Banner.png')" }}
>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">WHAT’S NEW!</h1>
        <p className="text-orange-400 text-xl mb-6">View The Latest Styles</p>
        <a
          href="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded transition duration-300"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
