export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">İletişim</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Sorularınız veya geri bildiriminiz var mı? Sizden duymayı çok isteriz. Ekibimizle iletişime geçin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center group hover:scale-105">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Telefon</h3>
            <p className="text-lg text-gray-600 mb-2">+1 (555) 123-4567</p>
            <p className="text-gray-500">Pzt-Cum 08:00-17:00</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center group hover:scale-105">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">E-posta</h3>
            <p className="text-lg text-gray-600 mb-2">support@trendyshop.com</p>
            <p className="text-gray-500">24 saat içinde yanıt veririz</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center group hover:scale-105">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ofis</h3>
            <p className="text-lg text-gray-600 mb-2">123 Commerce Street</p>
            <p className="text-gray-500">San Francisco, CA 94103</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Bize mesaj gönderin</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad
                </label>
                       <input
                         type="text"
                         id="name"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900 placeholder-gray-500"
                         placeholder="Adınız"
                       />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                       <input
                         type="email"
                         id="email"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900 placeholder-gray-500"
                         placeholder="ornek@email.com"
                       />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Konu
                </label>
                       <input
                         type="text"
                         id="subject"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900 placeholder-gray-500"
                         placeholder="Bu ne hakkında?"
                       />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj
                </label>
                       <textarea
                         id="message"
                         rows={5}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900 placeholder-gray-500"
                         placeholder="Mesajınız..."
                       ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Mesaj Gönder
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Konumumuz</h2>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl w-full h-96 mb-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-700">İnteraktif Harita</h3>
                <p className="text-gray-600">123 Commerce Street, San Francisco, CA 94103</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Çalışma Saatleri</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Pazartesi - Cuma</span>
                  <span className="text-gray-900 font-semibold">09:00 - 18:00</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Cumartesi</span>
                  <span className="text-gray-900 font-semibold">10:00 - 16:00</span>
                </li>
                <li className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Pazar</span>
                  <span className="text-gray-900 font-semibold">Kapalı</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}