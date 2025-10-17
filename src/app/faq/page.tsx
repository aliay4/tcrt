"use client";

import { useState } from 'react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "Siparişimi nasıl verebilirim?",
      answer: "Sipariş vermek için ürünü sepete ekleyin, sepetinizi kontrol edin ve ödeme sayfasına geçin. Ödeme bilgilerinizi girin ve siparişinizi tamamlayın."
    },
    {
      question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
      answer: "Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz. Tüm ödemeler güvenli SSL sertifikası ile korunmaktadır."
    },
    {
      question: "Kargo ücreti ne kadar?",
      answer: "150 TL ve üzeri siparişlerde kargo ücretsizdir. 150 TL altındaki siparişlerde 25 TL kargo ücreti alınmaktadır."
    },
    {
      question: "Siparişim ne kadar sürede teslim edilir?",
      answer: "Siparişleriniz 1-3 iş günü içinde kargoya verilir. Teslimat süresi şehir merkezlerinde 1-2 gün, diğer bölgelerde 2-5 gün arasındadır."
    },
    {
      question: "Ürün iadesi nasıl yapılır?",
      answer: "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. Ürün orijinal ambalajında ve kullanılmamış olmalıdır. İade kargo ücreti müşteriye aittir."
    },
    {
      question: "Hesabımı nasıl oluşturabilirim?",
      answer: "Sağ üst köşedeki 'Giriş Yap' butonuna tıklayın ve 'Kayıt Ol' seçeneğini seçin. E-posta adresinizi ve şifrenizi girerek hesabınızı oluşturabilirsiniz."
    },
    {
      question: "Şifremi unuttum, ne yapmalıyım?",
      answer: "Giriş sayfasında 'Şifremi Unuttum' linkine tıklayın. E-posta adresinizi girin ve size gönderilen link ile şifrenizi sıfırlayabilirsiniz."
    },
    {
      question: "Siparişimi nasıl takip edebilirim?",
      answer: "Hesabınıza giriş yaparak 'Siparişlerim' bölümünden siparişlerinizi takip edebilirsiniz. Kargo takip numarası ile de takip yapabilirsiniz."
    },
    {
      question: "Toptan alım yapabilir miyim?",
      answer: "Evet, bazı ürünlerimizde toptan fiyat seçenekleri mevcuttur. Toptan alım için bizimle iletişime geçebilirsiniz."
    },
    {
      question: "Müşteri hizmetlerine nasıl ulaşabilirim?",
      answer: "WhatsApp butonumuzu kullanarak, iletişim sayfamızdan veya e-posta ile bizimle iletişime geçebilirsiniz. 7/24 destek sağlıyoruz."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-lg text-gray-600">
            Aradığınız cevapları burada bulabilirsiniz
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Sorunuz mu var?</h2>
          <p className="text-lg mb-6 opacity-90">
            Aradığınız cevabı bulamadıysanız, bizimle iletişime geçin
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
