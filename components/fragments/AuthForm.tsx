'use client';

import { useState } from 'react';
import Input from '../elements/Input';
import Cookies from 'js-cookie';
import Button from '../elements/Button';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface AuthFormProps {
  mode: 'login' | 'register' | 'otp';
}

// Field form untuk semua mode
interface FormData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [form, setForm] = useState<FormData>({});
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Kirim OTP
  const handleRequestOTP = async () => {
    if (!form.phone) {
      Swal.fire('Error', 'Nomor HP wajib diisi', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data: { message: string } = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire('OTP dikirim!', data.message, 'success');
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Terjadi kesalahan', 'error');
    }
  };

  // Submit form register/login
  const handleSubmit = async () => {
    try {
      if (mode === 'otp') {
        if (!form.phone || !form.otp) {
          Swal.fire('Error', 'Nomor HP dan OTP wajib diisi', 'error');
          return;
        }
        const res = await fetch(`${API_URL}/api/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: form.phone, code: form.otp }),
        });
        const data: { token: string; message?: string } = await res.json();
        if (!res.ok) throw new Error(data.message || 'OTP salah');

        Cookies.set('token', data.token, { expires: 7 });
        Swal.fire('Login berhasil!', '', 'success');
        window.location.href = '/';
        return;
      }

      // Login/Register biasa
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');

      if (mode === 'login') {
        const { token, user } = data;
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('user_email', user.email);
        Cookies.set('user_name', user.name);

        Swal.fire({ icon: 'success', title: 'Login berhasil!', showConfirmButton: false, timer: 1500 });
        window.location.href = '/';
      } else {
        Swal.fire({ icon: 'success', title: 'Registrasi berhasil!', showConfirmButton: false, timer: 1500 });
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: err.message || 'Terjadi kesalahan!' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-1">
            <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
            <h1 className="text-xl font-bold text-black">Jaxel Fillament</h1>
          </div>
          <p className="text-sm text-gray-600">
            Silahkan {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Login dengan OTP'}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {mode === 'register' && <Input name="name" label="Nama Lengkap" onChange={handleChange} />}
          {(mode === 'register' || mode === 'login') && (
            <>
              <Input name="email" label="Email" type="email" onChange={handleChange} />
              <Input name="password" label="Password" type="password" onChange={handleChange} />
            </>
          )}
          {(mode === 'otp' || mode === 'register') && (
            <Input name="phone" label="Nomor HP" onChange={handleChange} />
          )}
          {mode === 'otp' && <Input name="otp" label="Masukkan OTP" onChange={handleChange} />}
        </div>

        {/* Buttons */}
        {mode === 'otp' && (
          <Button onClick={handleRequestOTP} className="bg-green-500 hover:bg-green-600 mt-6 w-full py-3 rounded-md text-white font-semibold">
            Kirim OTP
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 mt-4 text-white font-semibold w-full py-3 rounded-md"
        >
          {mode === 'login' ? 'Login' : mode === 'register' ? 'Daftar' : 'Verifikasi OTP'}
        </Button>

        {/* Links */}
        <div className="text-sm text-center mt-4">
          {mode === 'login' ? (
            <>
              Belum punya akun?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Daftar
              </Link>
            </>
          ) : mode === 'register' ? (
            <>
              Sudah punya akun?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
