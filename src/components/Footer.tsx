import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">TrendyShop</h3>
            <p className="text-gray-600 mb-4">
              Tüm alışveriş ihtiyaçlarınız için tek durak noktası. Uygun fiyatlarla kaliteli ürünler.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600">
                  S.S.S
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-blue-600">
                  Kargo
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-blue-600">
                  İade
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-600 hover:text-blue-600">
                  Sipariş Takibi
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Hakkımızda</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600">
                  TrendyShop Hakkında
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-blue-600">
                  Kariyer
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-blue-600">
                  Basın
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                  Şartlar ve Koşullar
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Uygulamamızı İndirin</h3>
            <p className="text-gray-600 mb-4">
              Mobil uygulamamızla her zaman, her yerde alışveriş yapın
            </p>
            <div className="flex flex-col space-y-3">
              <Link href="#" className="flex items-center bg-black text-white px-4 py-2 rounded-lg w-40">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 12.04C17.05 10.41 18.13 9.04 19.65 7.96C18.27 6.1 16.13 5.7 14.4 6.65C13.32 7.25 12.05 7.25 10.97 6.65C9.24 5.7 7.1 6.1 5.72 7.96C7.24 9.04 8.32 10.41 8.32 12.04C8.32 13.67 7.24 15.04 5.72 16.12C7.1 17.98 9.24 18.38 10.97 17.43C12.05 16.83 13.32 16.83 14.4 17.43C16.13 18.38 18.27 17.98 19.65 16.12C18.13 15.04 17.05 13.67 17.05 12.04ZM12.25 3C14.05 3 15.25 2.25 16.45 1C15.25 1 14.05 1.75 12.25 1.75C10.45 1.75 9.25 1 8.05 1C9.25 2.25 10.45 3 12.25 3Z"/>
                </svg>
                <div>
                  <div className="text-xs">İndir</div>
                  <div className="font-bold">App Store</div>
                </div>
              </Link>
              <Link href="#" className="flex items-center bg-black text-white px-4 py-2 rounded-lg w-40">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1.75 0h20.5C23.25 0 24 .75 24 1.75v20.5c0 .95-.75 1.75-1.75 1.75H1.75A1.75 1.75 0 0 1 0 22.25V1.75C0 .75.75 0 1.75 0zm12.25 14.5c0 .25-.2.45-.45.45h-2.1c-.25 0-.45-.2-.45-.45V9.45c0-.25.2-.45.45-.45h2.1c.25 0 .45.2.45.45v5.05zm4.5 0c0 .25-.2.45-.45.45h-2.1c-.25 0-.45-.2-.45-.45V9.45c0-.25.2-.45.45-.45h2.1c.25 0 .45.2.45.45v5.05zm-9 0c0 .25-.2.45-.45.45H6.45c-.25 0-.45-.2-.45-.45V9.45c0-.25.2-.45.45-.45h2.1c.25 0 .45.2.45.45v5.05zm13.5-8.5h-21v1.5h21V6z"/>
                </svg>
                <div>
                  <div className="text-xs">İNDİR</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">© 2025 TrendyShop. Tüm hakları saklıdır.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <img src="/payment-methods.png" alt="Ödeme yöntemleri" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
}