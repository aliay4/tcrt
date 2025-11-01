"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordWithToken } from "@/services/api";

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifreler uyuşmuyor.");
      return;
    }
    setLoading(true);
    try {
      console.log("Şifre reset istek başlatıldı");
      const result = await resetPasswordWithToken("", newPassword);
      setLoading(false);
      setMessage("Şifreniz başarıyla güncellendi! Anasayfaya yönlendiriliyorsunuz...");
      console.log("Şifre reset BAŞARILI — UI güncellendi!", result);
      setTimeout(() => {
        window.location.href = "/";
      }, 2500);
    } catch (err: any) {
      setLoading(false);
      console.error("Şifre sıfırlama hatası:", err);
      const errorMessage = err?.message || err?.error_description || (typeof err === "string" ? err : JSON.stringify(err)) || "Şifre güncellemesi başarısız oldu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      console.log("Şifre reset HATA — UI güncellendi!", errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg mt-20">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">Yeni Şifre Belirle</h2>
        <p className="text-gray-600 mb-6 text-center">E-posta ile gelen bağlantıdan yeni şifrenizi oluşturun.</p>
        {message && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-center">{message}</div>}
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900"
              placeholder="Yeni şifreniz"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (tekrar)</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900"
              placeholder="Yeni şifreyi tekrar yazın"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
