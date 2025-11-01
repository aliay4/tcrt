"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { categoryApi, productApi } from "@/services/api";
import { getLowestPrice } from "@/utils/priceCalculator";
import MediaDisplay from "@/components/MediaDisplay";

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  compare_price?: number;
  images?: string[];
  image_url?: string;
  media_url?: string;
  product_image?: string;
  quantity: number;
  stock_quantity?: number;
  has_price_tiers?: boolean;
}

export default function CategoryDetailsPage() {
  const params = useParams();
  const categoryId = Number(params.id);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [priceTiersMap] = useState<{ [key: number]: any[] }>({});

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      const [categoryRes, productsRes] = await Promise.all([
        categoryApi.getById(categoryId),
        productApi.getAll({ category: categoryId.toString() }),
      ]);

      setCategory(categoryRes.data);
      setProducts(productsRes.data);
      
      // Debug: Log product data to see what we're getting
      console.log('Products loaded:', productsRes.data);
      console.log('First product details:', productsRes.data[0]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  const sortedProducts = sortProducts(products);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Kategori yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kategori bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız kategori mevcut değil.</p>
          <Link 
            href="/categories" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Tüm kategorileri görüntüle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header with Enhanced Design */}
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            {/* Category Info */}
            <div className="flex items-center space-x-6">
              {/* Enhanced Category Image */}
              <div className="relative">
                {category.image_url ? (
                  <div className="relative">
                    <MediaDisplay 
                      mediaUrl={category.image_url}
                      alt={category.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-2xl ring-4 ring-white/30"
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-orange-600 text-sm font-bold">📦</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-white/30">
                    {category.name.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* Enhanced Category Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{category.name}</h1>
                {category.description && (
                  <p className="text-white/90 text-lg mb-3 drop-shadow-md">{category.description}</p>
                )}
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-white font-bold text-lg">{sortedProducts.length}</span>
                    <span className="text-white/90 ml-1">ürün</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-white/90 text-sm">🎯 Popüler kategori</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="text-gray-700">
            <span className="font-semibold text-gray-900">{sortedProducts.length}</span> ürün gösteriliyor
          </div>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-3 text-gray-700 font-medium">Sırala:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-900"
            >
              <option value="featured">Öne Çıkan</option>
              <option value="price-low">Fiyat: Düşükten Yükseğe</option>
              <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>
        </div>


        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h3>
              <p className="text-gray-600 mb-6">
                Bu kategoride henüz ürün yok. Daha sonra tekrar kontrol edin!
              </p>
              <Link
                href="/categories"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Tüm Kategorileri Görüntüle
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedProducts.map((product) => {
              const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 
                              product.image_url || 
                              product.media_url || 
                              product.product_image ||
                              null;
              const discount = product.compare_price 
                ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) 
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105"
                >
                  <div className="relative">
                    <div className="bg-gray-100 w-full h-48 overflow-hidden">
                      {imageUrl ? (
                        <MediaDisplay 
                          mediaUrl={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                          📦
                        </div>
                      )}
                    </div>
                    {product.has_price_tiers && priceTiersMap[product.id] && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Toptan Fiyat
                      </div>
                    )}
                    {discount > 0 && !product.has_price_tiers && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        -{discount}%
                      </div>
                    )}
                    {((product.stock_quantity || product.quantity || 0) === 0) && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 h-12 group-hover:text-orange-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex items-center">
                      {product.has_price_tiers && priceTiersMap[product.id] ? (
                        <>
                          <span className="text-xl font-bold text-orange-600">
                            ₺{Math.round(getLowestPrice(priceTiersMap[product.id], product.price))}'den başlayan
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₺{Math.round(product.price)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-orange-600">₺{Math.round(product.price)}</span>
                          {product.compare_price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">₺{Math.round(product.compare_price)}</span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="mt-3 flex items-center text-orange-600 text-sm font-medium">
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
