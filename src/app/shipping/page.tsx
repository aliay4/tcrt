"use client";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kargo ve Teslimat</h1>
          <p className="text-lg text-gray-600">
            Siparişlerinizin güvenli ve hızlı teslimatı için detaylı bilgiler
          </p>
        </div>

        {/* Shipping Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Free Shipping */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Ücretsiz Kargo</h2>
            </div>
            <p className="text-gray-600 mb-4">
              150 TL ve üzeri tüm siparişlerde kargo ücretsizdir.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold">
                ✓ Minimum tutar: 150 TL
              </p>
            </div>
          </div>

          {/* Standard Shipping */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Standart Kargo</h2>
            </div>
            <p className="text-gray-600 mb-4">
              150 TL altındaki siparişlerde 25 TL kargo ücreti alınır.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-semibold">
                ✓ Kargo ücreti: 25 TL
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Times */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Teslimat Süreleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">1-2 Gün</div>
              <h3 className="font-semibold text-gray-900 mb-2">İstanbul</h3>
              <p className="text-gray-600 text-sm">Şehir merkezi ve yakın ilçeler</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">2-3 Gün</div>
              <h3 className="font-semibold text-gray-900 mb-2">Büyük Şehirler</h3>
              <p className="text-gray-600 text-sm">Ankara, İzmir, Bursa, Antalya</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">3-5 Gün</div>
              <h3 className="font-semibold text-gray-900 mb-2">Diğer Bölgeler</h3>
              <p className="text-gray-600 text-sm">Tüm Türkiye geneli</p>
            </div>
          </div>
        </div>

        {/* Shipping Process */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kargo Süreci</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sipariş Onayı</h3>
                <p className="text-gray-600">Siparişiniz onaylandıktan sonra hazırlık süreci başlar.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Paketleme</h3>
                <p className="text-gray-600">Ürünleriniz özenle paketlenir ve kargo etiketleri hazırlanır.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Kargoya Teslim</h3>
                <p className="text-gray-600">Paketler kargo firmasına teslim edilir ve takip numarası alınır.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Teslimat</h3>
                <p className="text-gray-600">Kargo firması ürününüzü adresinize teslim eder.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Önemli Notlar</h2>
          <ul className="space-y-2 text-yellow-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Teslimat süreleri hafta sonları ve resmi tatiller hariç hesaplanır.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Kargo takip numaranız SMS ve e-posta ile size iletilecektir.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Teslimat sırasında kimlik kontrolü yapılabilir.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Adres bilgilerinizin doğru olduğundan emin olun.</span>
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Kargo ile ilgili sorularınız mı var?</h2>
          <p className="text-lg mb-6 opacity-90">
            Kargo takip numaranızı öğrenmek veya sorularınız için bizimle iletişime geçin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/track-order"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Sipariş Takibi
            </a>
            <a
              href="/contact"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              İletişime Geç
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
