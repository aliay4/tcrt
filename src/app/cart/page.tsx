"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  const shipping = items.length > 0 ? 5.99 : 0;
  const total = cartTotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sepet yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Alışveriş Sepeti</h1>
          <p className="text-xl text-white/90">
            Ürünlerinizi gözden geçirin ve ödemeye geçin
          </p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
      
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sepetiniz boş</h3>
              <p className="text-gray-500 mb-6">
                Sepetinize ürün eklemek için alışverişe başlayın
              </p>
              <Link
                href="/categories"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 hover:scale-105"
              >
                Ürünleri Görüntüle
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <h2 className="text-xl font-semibold text-gray-900">Sepet ({items.length} ürün)</h2>
                </div>
              
              <ul className="divide-y divide-gray-200">
                {items.map((item) => {
                  const product = item.product;
                  const price = product?.price || 0;
                  const comparePrice = product?.compare_price;
                  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
                  const imageUrl = product?.images && product.images.length > 0 ? product.images[0] : null;

                  return (
                    <li key={item.id} className="p-6">
                      <div className="flex">
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl overflow-hidden">
                          {imageUrl ? (
                            <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Resim yok
                            </div>
                          )}
                        </div>
                        <div className="ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link href={`/products/${item.product_id}`} className="hover:text-blue-600">
                                  {product?.name || 'Ürün'}
                                </Link>
                              </h3>
                              <div className="flex items-center mt-1">
                                <span className="text-gray-900 font-medium">₺{Math.round(price)}</span>
                                {item.applied_price && item.applied_price !== product?.price && (
                                  <span className="ml-2 text-gray-500 line-through">₺{Math.round(product?.price || 0)}</span>
                                )}
                                {comparePrice && !item.applied_price && (
                                  <>
                                    <span className="ml-2 text-gray-500 line-through">₺{Math.round(comparePrice)}</span>
                                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded">
                                      {discount}% OFF
                                    </span>
                                  </>
                                )}
                                {item.applied_price && item.applied_price !== product?.price && (
                                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-1.5 py-0.5 rounded">
                                    Toptan Fiyat
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-gray-900">
                                ₺{Math.round(price * item.quantity)}
                              </p>
                              {item.applied_price && item.applied_price !== product?.price && (
                                <p className="text-sm text-gray-500 line-through">
                                  ₺{Math.round((product?.price || 0) * item.quantity)}
                                </p>
                              )}
                              {comparePrice && !item.applied_price && (
                                <p className="text-sm text-gray-500 line-through">
                                  ₺{Math.round(comparePrice * item.quantity)}
                                </p>
                              )}
                              {item.applied_price && item.applied_price !== product?.price && (
                                <p className="text-xs text-green-600 font-medium">
                                  ₺{Math.round(((product?.price || 0) - item.applied_price) * item.quantity)} tasarruf
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 text-gray-600 hover:text-gray-900"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:text-gray-900"
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 text-red-600 hover:text-red-800"
                            >
                              Kaldır
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-6 p-6">
                <Link href="/categories" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="text-gray-900">₺{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span className="text-gray-900">₺{shipping.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-lg font-medium text-gray-900">Toplam</span>
                  <span className="text-lg font-medium text-gray-900">₺{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 hover:scale-105">
                Ödemeye Geç
              </button>
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-medium text-blue-800">₺100 üzeri siparişlerde ücretsiz kargo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
