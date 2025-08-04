// app/about/page.tsx (Next.js App Router)
export default function AboutPage() {
  return (
    <div className="min-h-screen  text-green-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 border-b-4 border-green-300 pb-2">Tentang Kami</h1>
        <p className="text-lg mb-6 leading-relaxed">
          Kami adalah tim yang berdedikasi untuk membangun solusi digital yang efisien dan ramah pengguna.
          Dengan semangat inovasi dan kolaborasi, kami berusaha memberikan dampak positif melalui teknologi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          <div className="p-6 bg-green-100 rounded-xl shadow-md transition hover:scale-105 hover:bg-green-200">
            <h2 className="text-2xl font-semibold mb-2">Misi Kami</h2>
            <p>
              Membangun aplikasi yang tidak hanya fungsional, tetapi juga memberikan pengalaman pengguna yang luar biasa.
            </p>
          </div>

          <div className="p-6 bg-green-100 rounded-xl shadow-md transition hover:scale-105 hover:bg-green-200">
            <h2 className="text-2xl font-semibold mb-2">Visi Kami</h2>
            <p>
              Menjadi mitra terpercaya dalam dunia digital dengan menghadirkan solusi yang berkelanjutan dan inovatif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
