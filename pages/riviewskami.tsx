'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ReviewForm from './components/fragments/RivewsForm';

export default function OurCompanyReview() {
  const router = useRouter();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/check`, {
          withCredentials: true, // Cookie akan ikut terkirim
        });

        console.log('User terautentikasi:', res.data.user);
        // Lanjut render komponen
      } catch (error) {
        console.log('Belum login, redirect ke /login');
        router.push('/login');
      }
    };

    checkLogin();
  }, []);

  return (
    <div>
      <h1>Form Ulasan Perusahaan</h1>
      {/* Render form di sini */}
      <ReviewForm />
    </div>
  );
}
