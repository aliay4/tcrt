"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gizlilik Politikası</h1>
          <p className="text-lg text-gray-600">
            Kişisel verilerinizin korunması bizim için önemli
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Son güncelleme: 1 Ocak 2025
          </p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
              <p className="text-gray-700 mb-4">
                TrendyShop olarak, kişisel verilerinizin güvenliği ve gizliliği bizim için öncelikli konulardan biridir. 
                Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi verir.
              </p>
              <p className="text-gray-700 mb-4">
                Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat hükümlerine uygun olarak hazırlanmıştır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Kişisel Veriler</h2>
              <p className="text-gray-700 mb-4">
                Hizmetlerimizi sunabilmek için aşağıdaki kişisel verilerinizi toplayabiliriz:
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-900 mb-3">Kimlik Verileri</h3>
                <ul className="list-disc list-inside text-blue-800">
                  <li>Ad, soyad</li>
                  <li>E-posta adresi</li>
                  <li>Telefon numarası</li>
                  <li>Doğum tarihi</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-green-900 mb-3">Adres Verileri</h3>
                <ul className="list-disc list-inside text-green-800">
                  <li>Teslimat adresi</li>
                  <li>Fatura adresi</li>
                  <li>Şehir, ilçe, posta kodu</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-yellow-900 mb-3">Finansal Veriler</h3>
                <ul className="list-disc list-inside text-yellow-800">
                  <li>Ödeme bilgileri (güvenli şekilde saklanır)</li>
                  <li>Fatura bilgileri</li>
                  <li>Kredi kartı bilgileri (şifrelenmiş)</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-purple-900 mb-3">Teknik Veriler</h3>
                <ul className="list-disc list-inside text-purple-800">
                  <li>IP adresi</li>
                  <li>Tarayıcı bilgileri</li>
                  <li>Çerez verileri</li>
                  <li>Cihaz bilgileri</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Veri Toplama Yöntemleri</h2>
              <p className="text-gray-700 mb-4">
                Kişisel verilerinizi aşağıdaki yöntemlerle toplarız:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Hesap oluşturma sırasında</li>
                <li>Sipariş verme sürecinde</li>
                <li>İletişim formları aracılığıyla</li>
                <li>Çerezler ve benzer teknolojiler</li>
                <li>Müşteri hizmetleri iletişimlerinde</li>
                <li>Sosyal medya etkileşimlerinde</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Veri Kullanım Amaçları</h2>
              <p className="text-gray-700 mb-4">
                Toplanan kişisel verilerinizi aşağıdaki amaçlarla kullanırız:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Hizmet Sunumu</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Sipariş işleme</li>
                    <li>• Teslimat yönetimi</li>
                    <li>• Müşteri desteği</li>
                    <li>• Hesap yönetimi</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">İletişim</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Sipariş bildirimleri</li>
                    <li>• Pazarlama mesajları</li>
                    <li>• Müşteri anketleri</li>
                    <li>• Duyuru ve güncellemeler</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Analiz ve Geliştirme</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Site performans analizi</li>
                    <li>• Kullanıcı deneyimi iyileştirme</li>
                    <li>• Ürün önerileri</li>
                    <li>• İstatistiksel analizler</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Yasal Yükümlülükler</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Vergi ve muhasebe kayıtları</li>
                    <li>• Yasal raporlama</li>
                    <li>• Denetim süreçleri</li>
                    <li>• Mahkeme kararları</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Veri Paylaşımı</h2>
              <p className="text-gray-700 mb-4">
                Kişisel verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Kargo ve lojistik hizmet sağlayıcıları (teslimat için)</li>
                <li>Ödeme işlem sağlayıcıları (güvenli ödeme için)</li>
                <li>Yasal zorunluluklar (mahkeme kararı, yasal düzenlemeler)</li>
                <li>Açık rızanızın bulunduğu durumlar</li>
                <li>Hizmet kalitesini artırmak için güvenilir iş ortakları</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Veri Güvenliği</h2>
              <p className="text-gray-700 mb-4">
                Kişisel verilerinizin güvenliği için aşağıdaki önlemleri alırız:
              </p>
              
              <div className="bg-red-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-red-900 mb-3">Teknik Önlemler</h3>
                <ul className="list-disc list-inside text-red-800">
                  <li>SSL sertifikası ile şifreli veri iletimi</li>
                  <li>Güvenli sunucu altyapısı</li>
                  <li>Düzenli güvenlik güncellemeleri</li>
                  <li>Erişim kontrolü ve yetkilendirme</li>
                  <li>Veri yedekleme ve kurtarma sistemleri</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-orange-900 mb-3">İdari Önlemler</h3>
                <ul className="list-disc list-inside text-orange-800">
                  <li>Personel eğitimleri</li>
                  <li>Gizlilik sözleşmeleri</li>
                  <li>Erişim logları ve denetim</li>
                  <li>Güvenlik politikaları</li>
                  <li>Olay müdahale planları</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Çerezler (Cookies)</h2>
              <p className="text-gray-700 mb-4">
                Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanırız:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Zorunlu Çerezler</h3>
                  <p className="text-sm text-blue-800">Site işlevselliği için gerekli</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Analitik Çerezler</h3>
                  <p className="text-sm text-green-800">Site kullanımını analiz etmek için</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Pazarlama Çerezleri</h3>
                  <p className="text-sm text-yellow-800">Kişiselleştirilmiş içerik için</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Haklarınız</h2>
              <p className="text-gray-700 mb-4">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Bilgi alma hakkı:</strong> Verilerinizin işlenip işlenmediğini öğrenme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Erişim hakkı:</strong> İşlenen verilerinizi talep etme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Düzeltme hakkı:</strong> Yanlış verilerin düzeltilmesini isteme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Silme hakkı:</strong> Verilerinizin silinmesini isteme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>İtiraz hakkı:</strong> Veri işlemeye itiraz etme</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span><strong>Taşınabilirlik hakkı:</strong> Verilerinizi başka yere aktarma</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Veri Saklama Süreleri</h2>
              <p className="text-gray-700 mb-4">
                Kişisel verilerinizi aşağıdaki süreler boyunca saklarız:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Hesap verileri: Hesap aktif olduğu sürece</li>
                <li>Sipariş verileri: 10 yıl (yasal zorunluluk)</li>
                <li>İletişim verileri: 3 yıl</li>
                <li>Pazarlama verileri: Rıza geri çekilene kadar</li>
                <li>Teknik veriler: 2 yıl</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. İletişim</h2>
              <p className="text-gray-700 mb-4">
                Gizlilik politikası ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Veri Sorumlusu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">İletişim Bilgileri</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>📧 E-posta: privacy@trendyshop.com</li>
                      <li>📞 Telefon: +90 555 123 45 67</li>
                      <li>💬 WhatsApp: +90 555 123 45 67</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Posta Adresi</h4>
                    <p className="text-gray-700">
                      TrendyShop A.Ş.<br />
                      Veri Koruma Birimi<br />
                      İstanbul, Türkiye
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Gizlilik politikasıyla ilgili sorularınız mı var?</h2>
          <p className="text-lg mb-6 opacity-90">
            Kişisel verilerinizle ilgili haklarınızı kullanmak için bizimle iletişime geçin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              İletişime Geç
            </a>
            <a
              href="mailto:privacy@trendyshop.com"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              E-posta Gönder
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
