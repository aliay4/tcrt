"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Favoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Favorilerim</h1>
          <p className="text-xl text-white/90">
            Kayıtlı ürünleriniz ve istek listesi öğeleriniz
          </p>
        </div>
      </div>

      {/* Favorites Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz favori yok</h3>
              <p className="text-gray-500 mb-6">
                Favorilerinizi burada görmek için ürün eklemeye başlayın
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((item) => {
              const product = item.product;
              const imageUrl = product?.images && product.images.length > 0 ? product.images[0] : null;
              const discount = product?.compare_price 
                ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) 
                : 0;

              return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative group hover:scale-105">
                  <Link href={`/products/${item.product_id}`}>
                    <div className="relative">
                      <div className="bg-gray-100 w-full h-48 overflow-hidden">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                            📦
                          </div>
                        )}
                      </div>
                      {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{discount}%
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors duration-300">
                        {product?.name || 'Ürün'}
                      </h3>
                      <div className="mt-3 flex items-center">
                        <span className="text-xl font-bold text-blue-600">₺{Math.round(product?.price || 0)}</span>
                        {product?.compare_price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">₺{Math.round(product.compare_price)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => removeFromFavorites(item.product_id)}
                    className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:scale-110"
                    title="Favorilerden kaldır"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
