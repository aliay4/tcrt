"use client";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">İade ve Değişim</h1>
          <p className="text-lg text-gray-600">
            Memnuniyetiniz bizim için önemli. İade süreciniz kolay ve hızlı
          </p>
        </div>

        {/* Return Conditions */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İade Koşulları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800">İade Edilebilir</h3>
              </div>
              <ul className="space-y-2 text-green-700">
                <li>• Teslim tarihinden itibaren 14 gün içinde</li>
                <li>• Orijinal ambalajında ve etiketli</li>
                <li>• Kullanılmamış ve hasarsız</li>
                <li>• Kişisel hijyen ürünleri hariç</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h3 className="text-lg font-semibold text-red-800">İade Edilemez</h3>
              </div>
              <ul className="space-y-2 text-red-700">
                <li>• Kişisel hijyen ürünleri</li>
                <li>• Kullanılmış veya hasarlı ürünler</li>
                <li>• Orijinal ambalajı bozulmuş</li>
                <li>• 14 günü geçen ürünler</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İade Süreci</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">İade Talebi Oluşturun</h3>
                <p className="text-gray-600">Hesabınızdan "Siparişlerim" bölümünden iade talebi oluşturun veya müşteri hizmetlerimizle iletişime geçin.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ürünü Hazırlayın</h3>
                <p className="text-gray-600">Ürünü orijinal ambalajında, etiketli ve kullanılmamış halde hazırlayın.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Kargo ile Gönderin</h3>
                <p className="text-gray-600">Ürünü kargo ile bize gönderin. Kargo ücreti müşteriye aittir.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">İade Onayı</h3>
                <p className="text-gray-600">Ürün kontrol edildikten sonra iade işlemi onaylanır ve ödeme iadesi yapılır.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İade Ödemeleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="font-semibold text-gray-900 mb-2">Kredi Kartı</h3>
              <p className="text-gray-600 text-sm">3-5 iş günü içinde hesabınıza yansır</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">🏦</div>
              <h3 className="font-semibold text-gray-900 mb-2">Banka Havalesi</h3>
              <p className="text-gray-600 text-sm">1-3 iş günü içinde hesabınıza yansır</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Kapıda Ödeme</h3>
              <p className="text-gray-600 text-sm">İade tutarı kargo firması tarafından ödenir</p>
            </div>
          </div>
        </div>

        {/* Exchange Information */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Değişim</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Ürün Değişimi</h3>
            <p className="text-blue-700 mb-4">
              Aynı ürünün farklı beden/renk seçeneği için değişim yapabilirsiniz. 
              Değişim işlemi için önce iade, sonra yeni sipariş süreci işletilir.
            </p>
            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="text-blue-800 font-semibold">
                💡 İpucu: Değişim için ürün fiyat farkı varsa ek ödeme yapmanız gerekebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Önemli Bilgiler</h2>
          <ul className="space-y-2 text-yellow-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>İade kargo ücreti müşteriye aittir (ücretsiz kargo limiti dahil değildir).</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>İade işlemi sırasında orijinal fatura veya fiş gereklidir.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Hediyelik ürünlerde iade süreci farklı olabilir.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>İade onayı sonrası ödeme iadesi 3-5 iş günü içinde yapılır.</span>
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">İade ile ilgili sorularınız mı var?</h2>
          <p className="text-lg mb-6 opacity-90">
            İade sürecinizde yardıma ihtiyacınız varsa bizimle iletişime geçin
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
