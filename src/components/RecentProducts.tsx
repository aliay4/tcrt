import React from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  is_active: boolean;
}

interface RecentProductsProps {
  products: Product[];
  totalProducts: number;
  forceRender: number;
}

const RecentProducts: React.FC<RecentProductsProps> = ({ products, totalProducts, forceRender }) => {
  console.log('RecentProducts bileşeni render:', { products, totalProducts, forceRender });
  
  const shouldShowEmpty = !products || products.length === 0;
  console.log('RecentProducts shouldShowEmpty:', shouldShowEmpty);
  
  if (shouldShowEmpty) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {totalProducts === 0 ? 'Henüz ürün yok' : 'Öne çıkan ürün yok'}
        </h3>
        <p className="text-gray-600 mb-4">
          {totalProducts === 0 
            ? 'İlk ürününüzü ekleyerek ürün kataloğunuzu oluşturmaya başlayın.'
            : 'Tüm ürünleriniz şu anda pasif. Burada görmek için bazı ürünleri aktifleştirin.'
          }
        </p>
        <Link href="/admin/products" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 inline-block">
          {totalProducts === 0 ? 'İlk Ürünü Ekle' : 'Ürünleri Yönet'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">₺{Math.round(product.price)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.is_active ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>
      ))}
      {products.length >= 5 && (
        <div className="text-center pt-4">
          <Link 
            href="/admin/products"
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Tüm ürünleri görüntüle →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentProducts;
