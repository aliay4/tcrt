import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Yüksel Ticaret Hakkında</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Kaliteli ürünler ve olağanüstü hizmetle en iyi online alışveriş deneyimini sunmaya adadık.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
            <p className="text-lg text-gray-600 mb-6">
              2025 yılında kurulan Yüksel Ticaret, basit bir misyonla başladı: kaliteli ürünleri herkese, her yerde erişilebilir kılmak. 
              Küçük bir online mağaza olarak başlayan işimiz, birden fazla kategoride binlerce ürün içeren kapsamlı bir platforma dönüştü.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Tutkulu profesyonellerden oluşan ekibimiz, en iyi ürünleri seçmek, tedarikçilerle uygun fiyatları müzakere etmek 
              ve her müşterinin sitemizi gözden geçirdiği andan paketinin geldiği ana kadar olağanüstü hizmet almasını sağlamak için durmaksızın çalışır.
            </p>
            <p className="text-lg text-gray-600">
              Müşterilerimiz ve tedarikçilerimizle güven, şeffaflık ve karşılıklı saygıya dayalı uzun vadeli ilişkiler kurmaya inanıyoruz.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Yolculuğumuz</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600">2025</div>
                <div className="text-sm text-gray-600">Kuruluş</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600">10K+</div>
                <div className="text-sm text-gray-600">Ürün</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600">50K+</div>
                <div className="text-sm text-gray-600">Müşteri</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600">99%</div>
                <div className="text-sm text-gray-600">Memnuniyet</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Misyonumuz</h2>
            <p className="text-xl mb-8 text-white/90">
              Eşsiz kaliteli ürün seçimi, rekabetçi fiyatlar ve olağanüstü müşteri hizmetleri sunarak 
              online alışveriş deneyimini devrimleştirmek.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold mb-4">10K+</div>
                <div className="text-lg">Ürün</div>
              </div>
              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold mb-4">50K+</div>
                <div className="text-lg">Mutlu Müşteri</div>
              </div>
              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold mb-4">99%</div>
                <div className="text-lg">Memnuniyet Oranı</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center group hover:scale-105">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Kalite Güvencesi</h3>
              <p className="text-gray-600 text-lg">
                Müşterilerimiz için en yüksek kalite standartlarını sağlamak amacıyla tüm tedarikçilerimizi ve ürünlerimizi dikkatle inceleriz.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center group hover:scale-105">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rekabetçi Fiyatlandırma</h3>
              <p className="text-gray-600 text-lg">
                Kaliteden ödün vermeden en iyi fiyatları sunmak için aracıları ortadan kaldırmak amacıyla doğrudan üreticilerle çalışırız.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center group hover:scale-105">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Müşteri Odaklılık</h3>
              <p className="text-gray-600 text-lg">
                Müşterilerimiz yaptığımız her şeyin kalbindir. Her etkileşimde beklentileri aşmaya çalışırız.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Topluluğumuza Katılın</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Alışveriş ihtiyaçları için bize güvenen memnun müşterilerin büyüyen topluluğumuzun bir parçası olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center justify-center">
              Alışverişe Başla
            </Link>
            <Link href="/contact" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 inline-flex items-center justify-center">
              İletişime Geçin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}