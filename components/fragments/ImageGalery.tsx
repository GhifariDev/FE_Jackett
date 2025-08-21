'use client';

import React, { useState } from 'react';

interface GalleryItem {
  src: string;
  caption: string;
}

const allItems: GalleryItem[] = [
  { src: '/kemeja_polos.jpg', caption: 'Kemeja Polos' },
  { src: '/kemeja_polos.jpg', caption: 'Kemeja Polos' },
  { src: '/kemeja_polos.jpg', caption: 'Kemeja Polos' },
  { src: '/kemeja_polos.jpg', caption: 'Kemeja Polos' },
  { src: '/kemeja_polos.jpg', caption: 'Kemeja Polos' },
  { src: '/baju2.jpg', caption: 'Kaos Branded' },
  { src: '/baju3.jpg', caption: 'Hoodie Bekas' },
  { src: '/baju4.jpg', caption: 'Blouse Wanita' },
  { src: '/baju5.jpg', caption: 'Sweater Oversize' },
  { src: '/baju6.jpg', caption: 'Jaket Denim' },
  { src: '/baju7.jpg', caption: 'Kaos Distro' },
  { src: '/baju8.jpg', caption: 'Baju Anak Branded' },
];

const ImageGallery = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, allItems.length));
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(4, prev - 4));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-black mb-3">Contoh Baju Pernah Dijual</h3>
      <div className="grid grid-cols-2 gap-4">
        {allItems.slice(0, visibleCount).map((item, index) => (
          <div
            key={index}
            className="text-center cursor-pointer"
            onClick={() => setPreviewImage(item.src)}
          >
            <img
              src={item.src}
              alt={item.caption}
              className="w-full h-32 object-cover rounded-lg border border-black"
            />
            <p className="text-xs text-black mt-1">{item.caption}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        {visibleCount < allItems.length && (
          <button
            onClick={handleShowMore}
            className="text-black hover:underline text-sm font-medium"
          >
            Lihat Lebih Banyak
          </button>
        )}
        {visibleCount > 4 && (
          <button
            onClick={handleShowLess}
            className="text-black hover:underline text-sm font-medium"
          >
            Lihat Lebih Sedikit
          </button>
        )}
      </div>

      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;