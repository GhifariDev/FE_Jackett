// components/ReviewForm.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

const ReviewForm = () => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post('https://feaea59b-29c1-410d-876c-82ef3311a0c5-00-2j44gkrr7d6ab.pike.replit.dev/api/review/company', {
        content,
        rating
      }, { withCredentials: true }); // kirim cookie JWT juga

      setSuccess(true);
      setContent('');
      setRating(5);
    } catch (error) {
      console.error('Gagal kirim ulasan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis ulasan tentang perusahaan..."
        className="w-full p-3 border border-gray-300 rounded"
        rows={4}
        required
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="p-2 border border-gray-300 rounded"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>{r} ⭐</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Mengirim...' : 'Kirim Ulasan'}
      </button>

      {success && <p className="text-green-600">Ulasan berhasil dikirim!</p>}
    </form>
  );
};

export default ReviewForm;
