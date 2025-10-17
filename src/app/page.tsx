"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { categoryApi, productApi, priceTierApi } from "@/services/api";
import { ProductCardSkeleton, CategoryCardSkeleton } from "@/components/SkeletonLoader";
import { getLowestPrice } from "@/utils/priceCalculator";
import MediaDisplay from "@/components/MediaDisplay";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Category {
  id: number;
  name: string;
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
  created_at?: string;
  has_price_tiers?: boolean;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceTiersMap, setPriceTiersMap] = useState<{ [key: number]: any[] }>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading homepage data...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const dataPromise = Promise.all([
        categoryApi.getAll({ status: 'active' }),
        productApi.getAll({ status: 'active' }),
      ]);
      
      const [categoriesRes, productsRes] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]) as any;

      console.log('Homepage data loaded successfully');
      setCategories(categoriesRes.data || []);
      
      // Öne çıkan ürünler (daha fazla ürün için 12'ye çıkarıyoruz)
      setFeaturedProducts((productsRes.data || []).slice(0, 12));
      
      // Yeni ürünler (son eklenen 4 ürün)
      const sortedProducts = [...(productsRes.data || [])].sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
      setNewProducts(sortedProducts.slice(0, 4));

      // Load price tiers for products with has_price_tiers
      const productsWithTiers = (productsRes.data || []).filter((p: any) => p.has_price_tiers);
      if (productsWithTiers.length > 0) {
        const tiersPromises = productsWithTiers.map(async (product: any) => {
          try {
            const tiersRes = await priceTierApi.getByProductId(product.id);
            return { productId: product.id, tiers: tiersRes.data };
          } catch (error) {
            console.error('Error loading price tiers for product:', product.id, error);
            return { productId: product.id, tiers: [] };
          }
        });

        const tiersResults = await Promise.all(tiersPromises);
        const tiersMap: { [key: number]: any[] } = {};
        tiersResults.forEach(({ productId, tiers }) => {
          tiersMap[productId] = tiers;
        });
        setPriceTiersMap(tiersMap);
      }
    } catch (error) {
      console.error('Error loading homepage data:', error);
      setCategories([]);
      setFeaturedProducts([]);
      setNewProducts([]);
      setPriceTiersMap({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoized components for better performance
  const ProductCard = useMemo(() => {
    const ProductItem = ({ product, isNew = false }: { product: Product; isNew?: boolean }) => {
      const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 
                      product.image_url || 
                      product.media_url || 
                      product.product_image ||
                      null;
      const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;

      return (
        <Link 
          href={`/products/${product.id}`}
          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-105 border border-gray-100"
        >
          <div className="relative">
            <div className="bg-gray-100 w-full h-40 rounded-t-xl overflow-hidden">
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
            {isNew && (
              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                YENİ
              </div>
            )}
            {product.has_price_tiers && priceTiersMap[product.id] && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Toptan Fiyat
              </div>
            )}
            {discount > 0 && !product.has_price_tiers && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discount}%
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 h-10 group-hover:text-orange-600 transition-colors duration-300 text-sm">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center">
              {product.has_price_tiers && priceTiersMap[product.id] ? (
                <>
                  <span className="text-lg font-bold text-orange-600">
                    ₺{Math.round(getLowestPrice(priceTiersMap[product.id], product.price))}'den başlayan
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₺{Math.round(product.price)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-orange-600">₺{Math.round(product.price)}</span>
                  {product.compare_price && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ₺{Math.round(product.compare_price)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </Link>
      );
    };
    return ProductItem;
  }, [priceTiersMap]);

  const CategoryCard = useMemo(() => {
    const CategoryItem = ({ category }: { category: Category }) => (
      <Link
        href={`/categories/${category.id}`}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-105"
      >
        <div className="bg-gray-100 w-full h-40 overflow-hidden rounded-t-xl">
          {category.image_url ? (
            <MediaDisplay 
              mediaUrl={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              {category.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
            {category.name}
          </h3>
          <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
            <span>Keşfet</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    );
    return CategoryItem;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
          <div className="text-xl text-gray-700 mb-2">Ana sayfa yükleniyor...</div>
          <div className="text-sm text-gray-500">Ürünler ve kategoriler getiriliyor</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-600 py-16 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <span className="text-yellow-300">TrendyShop</span>'a Hoş Geldiniz
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Oyuncak, teknoloji ve temizlik ürünlerinde toptan ve perakende fırsatları. Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center bg-white text-orange-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Alışverişe Başla
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white hover:text-orange-600 transition-all duration-300"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-2">10K+</div>
                    <div className="text-sm">Ürün</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-2">50K+</div>
                    <div className="text-sm">Mutlu Müşteri</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-2">99%</div>
                    <div className="text-sm">Memnuniyet</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm">Destek</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Günün Öne Çıkanları / Yeni Ürünler */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Günün Öne Çıkanları</h2>
            <p className="text-lg text-gray-600">Yeni ürünler ve özel fırsatlar</p>
          </div>
          
          {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
          ) : newProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-xl shadow-sm p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">🆕</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Yeni Ürün Yok</h3>
                <p className="text-gray-500">Yeni ürünler eklendiğinde burada görünecek.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} isNew={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tüm Kategoriler</h2>
          <p className="text-xl text-gray-600">Geniş ürün yelpazemizi keşfedin</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Kategori Yok</h3>
              <p className="text-gray-500">Kategoriler eklendiğinde burada görünecek.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
          <p className="text-xl text-gray-600">En popüler ve trend ürünlerimizi keşfedin</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Ürün Yok</h3>
              <p className="text-gray-500">Ürünler eklendiğinde burada görünecek.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={2}
              navigation={{
                nextEl: '.swiper-button-next-featured',
                prevEl: '.swiper-button-prev-featured',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination-featured',
              }}
              autoplay={{
                delay: 5000, // Increased from 3000ms to 5000ms for better performance
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 6,
                  spaceBetween: 24,
                },
              }}
              className="featured-products-swiper"
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="swiper-button-prev-featured absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-50 transition-colors duration-300">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next-featured absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-50 transition-colors duration-300">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Pagination */}
            <div className="swiper-pagination-featured flex justify-center mt-8"></div>
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Bugün Alışverişe Başla!</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Oyuncak, teknoloji ve temizlik ürünlerinde toptan ve perakende avantajları. Kaliteli ürünler, uygun fiyatlar ve güvenilir teslimat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center justify-center bg-white text-orange-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Tüm Ürünleri Görüntüle
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-4 px-8 rounded-full hover:bg-white hover:text-orange-600 transition-all duration-300"
              >
                Hakkımızda Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
