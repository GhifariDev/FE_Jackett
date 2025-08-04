'use client';

import { useState } from 'react';
import Input from '../elements/Input';
import Cookies from 'js-cookie';
import Button from '../elements/Button';
import Link from 'next/link';
import { LoginData, RegisterData } from '@/types/auth';

interface Props {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: Props) {
  const [form, setForm] = useState<Partial<RegisterData>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
    const res = await fetch(`https://46a780f1-beb6-46f3-8ef7-cd86ae9a391f-00-32rqnauvtwu7g.pike.replit.dev${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Terjadi kesalahan');

      if (mode === 'login') {
        const { token, user } = data;
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('user_email', user.email);
        Cookies.set('user_name', user.name);
        window.location.href = '/';
      } else {
        setSuccess(data.message || 'Registrasi berhasil');
      }

      setError('');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT: ILUSTRASI */}
      <div className="hidden md:flex w-1/2 bg-green-100 items-center justify-center p-10">
        <img
          src="/login.png"
          alt="Ilustrasi Jaket"
          className="object-cover"
        />
      </div>

      {/* RIGHT: FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10 bg-green-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-green-100">
          <h2 className="text-2xl font-bold text-green-800 mb-6 capitalize text-center">
            {mode === 'login' ? 'Login Akun' : 'Register Akun'}
          </h2>

          {mode === 'register' && (
            <Input name="name" label="Nama Lengkap" onChange={handleChange} />
          )}
          <Input name="email" label="Email" type="email" onChange={handleChange} />
          <Input name="password" label="Password" type="password" onChange={handleChange} />

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}

          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 w-full mt-6"
          >
            {mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
          </Button>

          <div className="mt-4 text-center text-sm">
            {mode === 'login' ? (
              <p>
                Belum punya akun?{' '}
                <Link href="/register" className="text-green-700 hover:underline font-medium">
                  Register di sini
                </Link>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <Link href="/login" className="text-green-700 hover:underline font-medium">
                  Login di sini
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
