'use client';

import { useState } from 'react';
import Input from '../elements/Input';
import Cookies from 'js-cookie';
import Button from '../elements/Button';
import Link from 'next/link';
import { LoginData, RegisterData } from '@/types/auth';
import Swal from 'sweetalert2';

interface Props {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: Props) {
  const [form, setForm] = useState<Partial<RegisterData>>({});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Terjadi kesalahan');

      if (mode === 'login') {
        const { token, user } = data;
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('user_email', user.email);
        Cookies.set('user_name', user.name);

        await Swal.fire({
          icon: 'success',
          title: 'Login berhasil!',
          showConfirmButton: false,
          timer: 1500,
        });

        window.location.href = '/';
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Registrasi berhasil!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message || 'Terjadi kesalahan!',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border">
        {/* Logo dan Heading */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-1">
            <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
            <h1 className="text-xl font-bold text-black">Jaxel Fillament</h1>
          </div>
          <p className="text-sm text-gray-600">Silahkan {mode === 'login' ? 'Login' : 'Register'}</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {mode === 'register' && (
            <Input name="name" label="Nama Lengkap" onChange={handleChange} />
          )}
          <Input name="email" label="Email" type="email" onChange={handleChange} />
          <Input name="password" label="Password" type="password" onChange={handleChange} />
        </div>

        {/* Button */}
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 mt-10 text-white font-semibold w-full mt-6 py-3 rounded-md"
        >
          {mode === 'login' ? 'Login' : 'Daftar'}
        </Button>

        {/* Link Daftar / Login */}
        <div className="text-sm text-center mt-4">
          {mode === 'login' ? (
            <>
              Belum punya akun?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Daftar
              </Link>
            </>
          ) : (
            <>
              Sudah punya akun?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Atau */}
        <div className="flex items-center justify-center my-4">
          <span className="w-full h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <span className="w-full h-px bg-gray-300" />
        </div>

        {/* Google Button */}
        <button
          onClick={() => Swal.fire('Fitur belum tersedia', 'Login dengan Google belum aktif.', 'info')}
          className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100 transition"
        >
          <img src="/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
          <span className="text-sm text-gray-700">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
