"use client";

import { useState } from 'react';

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        orderNumber: orderNumber || 'TS-2025-001234',
        status: 'Kargoda',
        currentLocation: 'İstanbul Dağıtım Merkezi',
        estimatedDelivery: '2025-01-20',
        trackingNumber: trackingNumber || 'TRK123456789',
        history: [
          {
            date: '2025-01-18 14:30',
            status: 'Sipariş Onaylandı',
            location: 'Yüksel Ticaret Depo'
          },
          {
            date: '2025-01-18 16:45',
            status: 'Kargoya Verildi',
            location: 'İstanbul Dağıtım Merkezi'
          },
          {
            date: '2025-01-19 09:15',
            status: 'Dağıtım Merkezinde',
            location: 'İstanbul Dağıtım Merkezi'
          }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sipariş Onaylandı':
        return 'bg-blue-100 text-blue-800';
      case 'Kargoya Verildi':
        return 'bg-yellow-100 text-yellow-800';
      case 'Kargoda':
        return 'bg-orange-100 text-orange-800';
      case 'Teslim Edildi':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sipariş Takibi</h1>
          <p className="text-lg text-gray-600">
            Siparişinizin durumunu takip edin ve teslimat bilgilerini öğrenin
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sipariş Takip</h2>
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sipariş Numarası
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="TS-2025-001234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  style={{ color: '#111827' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kargo Takip Numarası
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="TRK123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  style={{ color: '#111827' }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Aranıyor...
                </>
              ) : (
                'Siparişi Takip Et'
              )}
            </button>
          </form>
        </div>

        {/* Tracking Result */}
        {trackingResult && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sipariş Durumu</h2>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackingResult.status)}`}>
                {trackingResult.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Sipariş Numarası</h3>
                <p className="text-gray-600">{trackingResult.orderNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Kargo Takip No</h3>
                <p className="text-gray-600">{trackingResult.trackingNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Tahmini Teslimat</h3>
                <p className="text-gray-600">{trackingResult.estimatedDelivery}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Mevcut Konum</h3>
              <p className="text-blue-700">{trackingResult.currentLocation}</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Geçmişi</h3>
            <div className="space-y-4">
              {trackingResult.history.map((item: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-full mr-4 flex-shrink-0">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.status}</h4>
                        <p className="text-gray-600">{item.location}</p>
                      </div>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Sipariş numaramı nerede bulabilirim?</h3>
              <p className="text-gray-600">Sipariş numaranız e-posta ile gönderilen onay mesajında ve hesabınızın "Siparişlerim" bölümünde yer alır.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Kargo takip numarası ne zaman gelir?</h3>
              <p className="text-gray-600">Siparişiniz kargoya verildikten sonra SMS ve e-posta ile kargo takip numaranız size iletilecektir.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Siparişim neden gecikti?</h3>
              <p className="text-gray-600">Hava koşulları, yoğunluk veya adres sorunları teslimatı geciktirebilir. Detaylı bilgi için bizimle iletişime geçin.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Siparişinizle ilgili sorun mu var?</h2>
          <p className="text-lg mb-6 opacity-90">
            Sipariş takibi konusunda yardıma ihtiyacınız varsa bizimle iletişime geçin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              İletişime Geç
            </a>
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              WhatsApp Destek
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
