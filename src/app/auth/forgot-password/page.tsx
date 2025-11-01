"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendPasswordReset } from "@/services/api"; // Henüz implement edilmedi; bir sonraki adımda ekleyeceğiz.

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await sendPasswordReset(email); // Service fonksiyonunu buraya bağlayacağız.
      setMessage(
        "Eğer bu e-posta adresine kayıtlı bir kullanıcı varsa, şifre sıfırlama linki gönderildi."
      );
    } catch (err: any) {
      setError(
        err.message || "Sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg mt-20">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
          Şifremi Unuttum
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz.
        </p>
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-center">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-center">{error}</div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Adresiniz
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900"
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-orange-600 hover:underline">
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
}
