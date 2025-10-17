"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Şartlar ve Koşullar</h1>
          <p className="text-lg text-gray-600">
            TrendyShop kullanım şartları ve koşulları
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Son güncelleme: 1 Ocak 2025
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Hükümler</h2>
              <p className="text-gray-700 mb-4">
                Bu şartlar ve koşullar, TrendyShop web sitesi ve mobil uygulaması üzerinden yapılan tüm işlemleri kapsar. 
                Siteyi kullanarak bu şartları kabul etmiş sayılırsınız.
              </p>
              <p className="text-gray-700 mb-4">
                TrendyShop, bu şartları önceden haber vermeksizin değiştirme hakkını saklı tutar. 
                Değişiklikler site üzerinde yayınlandığı tarihten itibaren geçerli olur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hesap ve Kayıt</h2>
              <p className="text-gray-700 mb-4">
                Site üzerinden alışveriş yapabilmek için hesap oluşturmanız gerekmektedir. 
                Hesap oluştururken doğru ve güncel bilgiler vermeniz zorunludur.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Hesap bilgilerinizi güncel tutmanız sorumluluğunuzdadır</li>
                <li>Hesap güvenliğinizden siz sorumlusunuz</li>
                <li>Şüpheli aktiviteleri derhal bildirmeniz gerekmektedir</li>
                <li>Bir hesap üzerinden birden fazla kişi alışveriş yapamaz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sipariş ve Ödeme</h2>
              <p className="text-gray-700 mb-4">
                Siparişleriniz onaylandıktan sonra iptal edilemez. Ödeme işlemleri güvenli SSL sertifikası ile korunmaktadır.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Tüm fiyatlar KDV dahildir</li>
                <li>Ödeme yöntemleri: Kredi kartı, banka kartı, havale/EFT, kapıda ödeme</li>
                <li>Kapıda ödeme için ek ücret alınabilir</li>
                <li>Ödeme işlemi başarısız olursa sipariş iptal edilir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Teslimat ve Kargo</h2>
              <p className="text-gray-700 mb-4">
                Teslimat süreleri hafta sonları ve resmi tatiller hariç hesaplanır. 
                Kargo süreleri bölgeye göre değişiklik gösterebilir.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>150 TL ve üzeri siparişlerde kargo ücretsizdir</li>
                <li>150 TL altı siparişlerde 25 TL kargo ücreti alınır</li>
                <li>Teslimat sırasında kimlik kontrolü yapılabilir</li>
                <li>Adres bilgilerinin doğruluğu müşteri sorumluluğundadır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. İade ve Değişim</h2>
              <p className="text-gray-700 mb-4">
                Ürünleri teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. 
                İade koşulları ürün kategorisine göre değişiklik gösterebilir.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Ürün orijinal ambalajında ve kullanılmamış olmalıdır</li>
                <li>Kişisel hijyen ürünleri iade edilemez</li>
                <li>İade kargo ücreti müşteriye aittir</li>
                <li>İade onayı sonrası ödeme iadesi 3-5 iş günü içinde yapılır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Gizlilik ve Kişisel Veriler</h2>
              <p className="text-gray-700 mb-4">
                Kişisel verileriniz Gizlilik Politikamız kapsamında korunmaktadır. 
                Verileriniz sadece hizmet sunumu amacıyla kullanılır.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Kişisel verileriniz üçüncü taraflarla paylaşılmaz</li>
                <li>Veri güvenliği için gerekli önlemler alınmıştır</li>
                <li>KVKK kapsamında haklarınızı kullanabilirsiniz</li>
                <li>Çerezler site deneyimini iyileştirmek için kullanılır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sorumluluk Sınırları</h2>
              <p className="text-gray-700 mb-4">
                TrendyShop, mücbir sebep durumlarında sorumluluk kabul etmez. 
                Mücbir sebep: Doğal afetler, savaş, grev, hükümet kararları vb.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Teknik arızalar nedeniyle oluşan zararlardan sorumlu değiliz</li>
                <li>Üçüncü taraf hizmetlerinden kaynaklanan sorunlardan sorumlu değiliz</li>
                <li>Müşteri hatalarından kaynaklanan zararlardan sorumlu değiliz</li>
                <li>Sorumluluğumuz ödenen bedel ile sınırlıdır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Fikri Mülkiyet Hakları</h2>
              <p className="text-gray-700 mb-4">
                Site içeriği, tasarım ve yazılım TrendyShop'un fikri mülkiyetidir. 
                İzinsiz kullanım yasaktır.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Site içeriği telif hakkı ile korunmaktadır</li>
                <li>Marka ve logolarımız koruma altındadır</li>
                <li>İzinsiz kopyalama ve dağıtım yasaktır</li>
                <li>İhlal durumunda yasal işlem başlatılabilir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Uyuşmazlık Çözümü</h2>
              <p className="text-gray-700 mb-4">
                Bu şartlardan doğan uyuşmazlıklar öncelikle dostane yollarla çözülmeye çalışılır. 
                Çözülemezse İstanbul Mahkemeleri yetkilidir.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Öncelikle müşteri hizmetleri ile iletişime geçin</li>
                <li>Uyuşmazlık çözümü için arabuluculuk kullanılabilir</li>
                <li>Son çare olarak mahkeme yoluna başvurulabilir</li>
                <li>Türk hukuku geçerlidir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. İletişim</h2>
              <p className="text-gray-700 mb-4">
                Bu şartlar ve koşullar ile ilgili sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>📧 E-posta: info@trendyshop.com</li>
                  <li>📞 Telefon: +90 555 123 45 67</li>
                  <li>💬 WhatsApp: +90 555 123 45 67</li>
                  <li>🌐 Web: www.trendyshop.com</li>
                </ul>
              </div>
            </section>

          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Şartlar ve koşullarla ilgili sorularınız mı var?</h2>
          <p className="text-lg mb-6 opacity-90">
            Detaylı bilgi almak için bizimle iletişime geçin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              İletişime Geç
            </a>
            <a
              href="/faq"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              S.S.S
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
