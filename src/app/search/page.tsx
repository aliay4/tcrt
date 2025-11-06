"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { productApi } from "@/services/api";
import { getLowestPrice } from "@/utils/priceCalculator";
import Pagination from "@/components/Pagination";

interface Product {
  id: number;
  name: string;
  price: number;
  compare_price?: number;
  images?: string[];
  image_url?: string;
  media_url?: string;
  product_image?: string;
  description?: string;
  stock_quantity?: number;
  has_price_tiers?: boolean;
  created_at?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceTiersMap] = useState<{ [key: number]: any[] }>({});
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState<
    "name" | "price_asc" | "price_desc" | "newest"
  >("name");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentPage(1); // Reset to first page on new search

    try {
      const result = await productApi.getAll({
        search: searchTerm,
        status: "active",
      });
      // Sadece aktif ürünleri filtrele
      const activeProducts = result.data.filter(
        (product: any) => product.is_active,
      );
      setProducts(activeProducts);
    } catch (error) {
      console.error("Search error:", error);
      setError("Arama sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
      // URL'i güncelle
      window.history.pushState(
        {},
        "",
        `/search?q=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const price = product.price;
    return price >= priceRange.min && price <= priceRange.max;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
        );
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getImageUrl = (product: Product) => {
    return product.images && product.images.length > 0
      ? product.images[0]
      : product.image_url || product.media_url || product.product_image || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Arama Sonuçları
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün, marka ve daha fazlasını arayın..."
                className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 shadow-lg"
            >
              Ara
            </button>
          </form>

          {/* Results Info */}
          {query && (
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold">"{query}"</span> için{" "}
                <span className="font-semibold">{products.length}</span> sonuç
                bulundu
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                Filtreler
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-64 bg-white rounded-xl shadow-sm p-6 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filtreler
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Fiyat Aralığı
                </h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Sıralama
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="name">İsim (A-Z)</option>
                  <option value="price_asc">Fiyat (Düşük-Yüksek)</option>
                  <option value="price_desc">Fiyat (Yüksek-Düşük)</option>
                  <option value="newest">En Yeni</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setPriceRange({ min: 0, max: 10000 });
                  setSortBy("name");
                }}
                className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
                  >
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-xl mb-4">❌</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Arama Hatası
                </h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sonuç Bulunamadı
                </h3>
                <p className="text-gray-600">
                  {query
                    ? `"${query}" için arama sonucu bulunamadı.`
                    : "Arama yapmak için yukarıdaki kutuyu kullanın."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {paginatedProducts.map((product) => {
                    const imageUrl = getImageUrl(product);
                    const discount = product.compare_price
                      ? Math.round(
                          ((product.compare_price - product.price) /
                            product.compare_price) *
                            100,
                        )
                      : 0;

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-105"
                      >
                        <div className="relative">
                          <div className="bg-gray-100 w-full h-48 rounded-t-xl overflow-hidden">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                                📦
                              </div>
                            )}
                          </div>
                          {product.has_price_tiers &&
                            priceTiersMap[product.id] && (
                              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Toptan Fiyat
                              </div>
                            )}
                          {discount > 0 && !product.has_price_tiers && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{discount}%
                            </div>
                          )}
                          {product.stock_quantity === 0 && (
                            <div className="absolute top-3 left-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Stok Yok
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 h-12 group-hover:text-orange-600 transition-colors duration-300 text-sm">
                            {product.name}
                          </h3>
                          <div className="mt-3 flex items-center">
                            {product.has_price_tiers &&
                            priceTiersMap[product.id] ? (
                              <>
                                <span className="text-lg font-bold text-orange-600">
                                  ₺
                                  {Math.round(
                                    getLowestPrice(
                                      priceTiersMap[product.id],
                                      product.price,
                                    ),
                                  )}
                                  'den başlayan
                                </span>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ₺{Math.round(product.price)}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-lg font-bold text-orange-600">
                                  ₺{Math.round(product.price)}
                                </span>
                                {product.compare_price && (
                                  <span className="ml-2 text-sm text-gray-500 line-through">
                                    ₺{Math.round(product.compare_price)}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          {product.stock_quantity !== undefined && (
                            <div className="mt-2 text-xs text-gray-500">
                              Stok:{" "}
                              {product.stock_quantity > 0
                                ? `${product.stock_quantity} adet`
                                : "Tükendi"}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      totalItems={sortedProducts.length}
                      showInfo={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
