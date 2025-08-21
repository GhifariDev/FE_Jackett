'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import ReviewForm from '../components/fragments/RivewsForm';

// Types
interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface ApiResponse {
  user: User;
  message?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export default function OurCompanyReview(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const verifyAuthentication = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!API_URL) {
          throw new Error('API URL is not configured');
        }
        
        const response = await axios.get<ApiResponse>(`${API_URL}/api/check`, {
          withCredentials: true,
          timeout: 10000, // 10 detik timeout
        });

        if (response.data.user) {
          setUser(response.data.user);
          console.log('Authentication successful:', response.data.user);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        const errorMessage = handleAuthError(error);
        console.error('Authentication failed:', errorMessage);
        setError(errorMessage);
        
        // Delay redirect untuk UX yang lebih baik
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuthentication();
  }, [API_URL, router]);

  // Error handler function
  const handleAuthError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      
      if (axiosError.response?.status === 401) {
        return 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (axiosError.response?.status === 403) {
        return 'Anda tidak memiliki akses ke halaman ini.';
      } else if (axiosError.code === 'ECONNABORTED') {
        return 'Koneksi timeout. Silakan coba lagi.';
      } else if (axiosError.message === 'Network Error') {
        return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
      
      return axiosError.response?.data?.message || 'Terjadi kesalahan pada server.';
    } else if (error instanceof Error) {
      return error.message;
    }
    
    return 'Terjadi kesalahan yang tidak dikenal.';
  };

  // Loading component
  const LoadingComponent = (): JSX.Element => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memverifikasi akses...</p>
      </div>
    </div>
  );

  // Error component
  const ErrorComponent = (): JSX.Element => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Akses Ditolak</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="text-sm text-gray-500">
          Mengarahkan ke halaman login dalam beberapa detik...
        </div>
      </div>
    </div>
  );

  // User info component
  const UserInfo = ({ user }: { user: User }): JSX.Element => (
    <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
      </svg>
      Masuk sebagai {user.name || user.email}
    </div>
  );

  // Conditional rendering
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bagikan Pengalaman Anda
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Berikan ulasan yang konstruktif tentang pengalaman Anda bersama perusahaan kami. 
            Masukan Anda sangat berharga untuk pengembangan layanan yang lebih baik.
          </p>
          
          {user && <UserInfo user={user} />}
        </div>

        {/* Review Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-semibold text-white">Form Ulasan</h2>
              <p className="text-blue-100 mt-2">
                Ceritakan pengalaman Anda dengan jujur dan detail
              </p>
            </div>
            
            <div className="p-8">
              <ReviewForm />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Panduan Ulasan
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Mohon berikan ulasan yang objektif dan konstruktif. Hindari penggunaan kata-kata kasar atau menyinggung. 
                    Ulasan Anda akan membantu kami dalam meningkatkan kualitas layanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}