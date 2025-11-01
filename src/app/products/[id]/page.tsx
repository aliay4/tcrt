"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { productApi, priceTierApi, similarProductsApi } from "@/services/api";
import { getLowestPrice } from "@/utils/priceCalculator";
import MediaDisplay from "@/components/MediaDisplay";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/hooks/useToast";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  images?: string[];
  image_url?: string;
  media_url?: string;
  product_image?: string;
  created_at?: string;
  has_price_tiers?: boolean;
  stock_quantity?: number;
  category_id?: number;
  category_name?: string;
}

interface PriceTier {
  id: number;
  min_quantity: number;
  max_quantity?: number;
  price: number;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productId = params.id as string;

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadSimilarProducts();
    }
  }, [productId]);

  // Klavye ok tuşları ile medya geçişi
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;

    const imagesArray = product.images || [];
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : imagesArray.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev < imagesArray.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productRes = await productApi.getById(parseInt(productId));
      setProduct(productRes.data);

      // Load price tiers if product has them
      if (productRes.data.has_price_tiers) {
        try {
          const tiersRes = await priceTierApi.getByProductId(parseInt(productId));
          setPriceTiers(tiersRes.data);
        } catch (error) {
          console.error('Error loading price tiers:', error);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      showToast({ type: 'error', title: 'Ürün yüklenirken bir hata oluştu' });
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProducts = async () => {
    try {
      setSimilarLoading(true);
      const response = await similarProductsApi.getSimilarProducts(parseInt(productId), 6);
      if (response.success) {
        setSimilarProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading similar products:', error);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    
    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
        showToast({ type: 'success', title: 'Favorilerden çıkarıldı' });
      } else {
        await addToFavorites(product.id);
        showToast({ type: 'success', title: 'Favorilere eklendi' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast({ type: 'error', title: 'Favori işlemi başarısız' });
    }
  };

  const isProductFavorite = product ? isFavorite(product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ürün Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link
            href="/"
            className="inline-flex items-center bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImageIndex] || 
                   product.image_url || 
                   product.media_url || 
                   product.product_image || 
                   null;

  const discount = product.compare_price ? 
    Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;

  const getCurrentPrice = () => {
    if (product.has_price_tiers && priceTiers.length > 0) {
      return getLowestPrice(priceTiers, product.price);
    }
    return product.price;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-orange-600 transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/categories" className="hover:text-orange-600 transition-colors">
                Kategoriler
              </Link>
            </li>
            {product.category_name && (
              <>
                <li>/</li>
                <li className="text-gray-900">{product.category_name}</li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden relative group">
              <div className="aspect-square bg-gray-100">
                {mainImage ? (
                  <MediaDisplay
                    mediaUrl={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                    📦
                  </div>
                )}
              </div>
              
              {/* Soluk ok butonları - sadece birden fazla medya varsa göster */}
              {images.length > 1 && (
                <>
                  {/* Sol ok */}
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 opacity-30 hover:opacity-80 transition-all duration-200 backdrop-blur-sm group-hover:opacity-60"
                    aria-label="Önceki medya"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Sağ ok */}
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 opacity-30 hover:opacity-80 transition-all duration-200 backdrop-blur-sm group-hover:opacity-60"
                    aria-label="Sonraki medya"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-orange-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MediaDisplay
                      mediaUrl={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      isThumbnail={true}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title and Badges */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                {product.has_price_tiers && priceTiers.length > 0 && (
                  <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Toptan Fiyat
                  </span>
                )}
                {discount > 0 && !product.has_price_tiers && (
                  <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                    -{discount}% İndirim
                  </span>
                )}
                {product.stock_quantity === 0 && (
                  <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Stokta Yok
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-orange-600">
                  ₺{Math.round(getCurrentPrice())}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ₺{Math.round(product.compare_price)}
                  </span>
                )}
              </div>
              
              {product.has_price_tiers && priceTiers.length > 0 && (
                <p className="text-sm text-gray-600">
                  {Math.round(getCurrentPrice())}'den başlayan fiyatlar
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürün Açıklaması</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Price Tiers Table */}
            {product.has_price_tiers && priceTiers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Toptan Fiyatlar</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Adet</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Birim Fiyat</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceTiers.map((tier) => (
                        <tr key={tier.id} className="border-t border-gray-100">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {tier.min_quantity}{tier.max_quantity ? `-${tier.max_quantity}` : '+'} adet
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ₺{Math.round(tier.price)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ₺{Math.round(tier.price * (tier.max_quantity || tier.min_quantity))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-900">Adet:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {product.stock_quantity === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                </button>
                
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isProductFavorite
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <svg className="w-6 h-6" fill={isProductFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stock Info */}
            {product.stock_quantity !== undefined && (
              <div className="text-sm text-gray-600">
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600">Stokta {product.stock_quantity} adet var</span>
                ) : (
                  <span className="text-red-600">Stokta yok</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Benzer Ürünler</h2>
              <p className="text-lg text-gray-600">Bu ürünle ilgili diğer seçenekler</p>
            </div>
            
            {similarLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {similarProducts.map((similarProduct) => {
                  const imageUrl = similarProduct.image_url;
                  const discount = similarProduct.compare_price ? 
                    Math.round(((similarProduct.compare_price - similarProduct.price) / similarProduct.compare_price) * 100) : 0;

                  return (
                    <Link 
                      key={similarProduct.id} 
                      href={`/products/${similarProduct.id}`}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-105 border border-gray-100"
                    >
                      <div className="relative">
                        <div className="bg-gray-100 w-full h-48 rounded-t-xl overflow-hidden">
                          {imageUrl ? (
                            <MediaDisplay 
                              mediaUrl={imageUrl}
                              alt={similarProduct.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                              📦
                            </div>
                          )}
                        </div>
                        {similarProduct.has_price_tiers && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Toptan
                          </div>
                        )}
                        {discount > 0 && !similarProduct.has_price_tiers && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{discount}%
                          </div>
                        )}
                        {similarProduct.stock_quantity === 0 && (
                          <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Stokta Yok
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 h-10 group-hover:text-orange-600 transition-colors duration-300 text-sm">
                          {similarProduct.name}
                        </h3>
                        <div className="mt-2 flex items-center">
                          <span className="text-lg font-bold text-orange-600">
                            ₺{Math.round(similarProduct.price)}
                          </span>
                          {similarProduct.compare_price && similarProduct.compare_price > similarProduct.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₺{Math.round(similarProduct.compare_price)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center text-orange-600 text-sm font-medium">
                          <span>Detayları Gör</span>
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
        )}
      </div>
    </div>
  );
}
