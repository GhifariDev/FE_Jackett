import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface ApiResponse {
  message?: string;
}

interface ProfilePageProps {}

export default function ProfilePage({}: ProfilePageProps): JSX.Element {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [requestLoading, setRequestLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);
const [userPhone, setUserPhone] = useState<string>("");
  // Timer untuk resend OTP
  useEffect((): (() => void) => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval((): void => {
        setResendTimer((prev: number): number => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return (): void => clearInterval(interval);
  }, [resendTimer]);

  const handleBecomeSeller = (): void => {
    setShowOtp(true);
    handleRequestSellerOTP();
  };
const handleRequestSellerOTP = async (): Promise<void> => {
  setRequestLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/request`, {
      method: "POST",
      credentials: "include", // ✅ backend tahu user dari cookie/session
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(data.message || "OTP telah dikirim!");
      setCanResend(false);
      setResendTimer(60);
      Swal.fire({
        icon: 'success',
        title: 'OTP Berhasil Dikirim!',
        text: data.message,
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    } else {
      setError(data.message || "Gagal request OTP");
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim OTP',
        text: data.message,
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  } catch (err) {
    console.error(err);
    setError("Terjadi kesalahan saat mengirim OTP");
  } finally {
    setRequestLoading(false);
  }
};



 const handleVerifyOtp = async (): Promise<void> => {
  if (otp.length !== 6) {
    setError("OTP harus 6 digit");
    Swal.fire({
      icon: 'warning',
      title: 'OTP Tidak Valid',
      text: "Kode OTP harus terdiri dari 6 digit",
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-seller-otp`, {
      method: "POST",
      credentials: "include", // ✅ backend tahu siapa usernya
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }), // hanya OTP
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(data.message || "Verifikasi berhasil!");
      Swal.fire({
        icon: 'success',
        title: 'Verifikasi Berhasil!',
        text: data.message || "Anda berhasil menjadi seller",
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      setTimeout(() => router.push("/penjualan-baju"), 1500);
    } else {
      setError(data.message || "OTP salah atau kadaluarsa");
      Swal.fire({
        icon: 'error',
        title: 'Verifikasi Gagal',
        text: data.message || "OTP yang Anda masukkan salah atau sudah kadaluarsa",
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  } catch (err) {
    console.error(err);
    setError("Terjadi kesalahan saat verifikasi");
    Swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan',
      text: "Tidak dapat terhubung ke server",
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  } finally {
    setLoading(false);
  }
};


  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (error) setError("");
  };

  const handleResendOtp = async (): Promise<void> => {
    if (!canResend) return;
    
    setOtp("");
    setError("");
    setSuccess("");
    await handleRequestSellerOTP();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Pengguna</h1>
          <p className="text-gray-600">Bergabung sebagai seller dan mulai berjualan</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {!showOtp ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Menjadi Seller</h3>
              <p className="text-sm text-gray-600 mb-6">
                Dapatkan akses ke dashboard seller dan mulai berjualan produk Anda
              </p>
            </div>
            
            <button
              onClick={handleBecomeSeller}
              disabled={requestLoading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {requestLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Mengirim OTP...
                </div>
              ) : (
                "Jadi Seller"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verifikasi OTP</h3>
              <p className="text-sm text-gray-600 mb-6">
                Masukkan kode 6 digit yang telah dikirim ke email Anda
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Kode OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {otp.length}/6 digit
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memverifikasi...
                  </div>
                ) : (
                  "Verifikasi OTP"
                )}
              </button>

              <button
                onClick={handleResendOtp}
                disabled={requestLoading || !canResend}
                className="w-full px-6 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!canResend ? `Kirim Ulang OTP (${resendTimer}s)` : "Kirim Ulang OTP"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Masukkan kode OTP yang dikirim ke email Anda
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}