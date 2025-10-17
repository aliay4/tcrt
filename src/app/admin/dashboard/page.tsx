"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { productApi, categoryApi } from "@/services/api";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  quantity: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    recentProducts: [] as Product[]
  });

  useEffect(() => {
    fetchDashboardData(true); // Initial load with loading state
    
    // Refresh data every 30 seconds for better performance
    const interval = setInterval(() => {
      fetchDashboardData(false); // Background refresh without loading
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      
      console.log('Fetching dashboard data...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const dataPromise = Promise.all([
        productApi.getAll(),
        categoryApi.getAll()
      ]);
      
      const [productsResponse, categoriesResponse] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]) as any;

      console.log('Dashboard data fetched successfully');
      
      const products = productsResponse.data || [];
      const categories = categoriesResponse.data || [];
      
      const activeProducts = products.filter((p: any) => p.is_active).length;
      const inactiveProducts = products.filter((p: any) => !p.is_active).length;
      const recentProducts = products.filter((p: any) => p.is_active).slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        activeProducts,
        inactiveProducts,
        recentProducts
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (isInitialLoad) {
        (window as any).toast?.error(
          'Data Load Failed',
          `Failed to load dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, []);

  // Memoized components for better performance
  const StatsCard = useMemo(() => {
    const StatCard = ({ title, value, subtitle, icon, bgColor, textColor }: {
      title: string;
      value: number;
      subtitle: string;
      icon: React.ReactNode;
      bgColor: string;
      textColor: string;
    }) => (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-2">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm font-semibold ${textColor} mt-2 flex items-center`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              {subtitle}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
            {icon}
          </div>
        </div>
      </div>
    );
    return StatCard;
  }, []);

  const ProductCard = useMemo(() => {
    const ProductItem = ({ product }: { product: Product }) => (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-12 w-12">
            {product.image_url ? (
              <img
                className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200"
                src={product.image_url}
                alt={product.name}
                loading="lazy"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
            <p className="text-xs text-gray-500">₺{Math.round(product.price || 0)} • {product.quantity} units</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            product.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${
              product.is_active ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            {product.is_active ? 'Aktif' : 'Pasif'}
          </span>
          <Link 
            href={`/admin/products`}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Görüntüle →
          </Link>
        </div>
      </div>
    );
    return ProductItem;
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <AdminHeader 
          title="Kontrol Paneli" 
          subtitle="Tekrar hoş geldiniz! Mağazanızda neler oluyor."
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        >
            <button 
            onClick={() => fetchDashboardData(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
            >
            🔄 Verileri Yenile
            </button>
        </AdminHeader>

        {/* Dashboard Content */}
        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600 mb-2">Kontrol paneli verileri yükleniyor...</p>
                <p className="text-sm text-gray-500">Bu işlem biraz zaman alabilir</p>
              </div>
            </div>
          ) : (
            <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Toplam Ürün"
              value={stats.totalProducts}
              subtitle={stats.totalProducts > 0 ? `katalogda ${stats.totalProducts} ürün` : 'Henüz ürün yok'}
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            
            <StatsCard
              title="Kategoriler"
              value={stats.totalCategories}
              subtitle={stats.totalCategories > 0 ? `${stats.totalCategories} kategori mevcut` : 'Henüz kategori yok'}
              icon={
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
            
            <StatsCard
              title="Aktif Ürünler"
              value={stats.activeProducts}
              subtitle={stats.activeProducts > 0 ? `${stats.activeProducts} ürün aktif` : 'Aktif ürün yok'}
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            
            <StatsCard
              title="Pasif Ürünler"
              value={stats.inactiveProducts}
              subtitle={stats.inactiveProducts > 0 ? `${stats.inactiveProducts} ürün pasif` : 'Tüm ürünler aktif'}
              icon={
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              bgColor="bg-orange-100"
              textColor="text-orange-600"
            />
          </div>
            </>
          )}

          {/* Featured Products */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Öne Çıkan Ürünler</h2>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Kataloğunuzdaki aktif ürünler</p>
                </div>
                <Link href="/admin/products" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105">
                  Ürünleri Yönet
                </Link>
              </div>
            </div>
            <div className="p-6">
              {!stats.recentProducts || stats.recentProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {stats.totalProducts === 0 ? 'Henüz ürün yok' : 'Aktif ürün yok'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {stats.totalProducts === 0 
                      ? 'İlk ürününüzü ekleyerek ürün kataloğunuzu oluşturmaya başlayın.'
                      : 'Tüm ürünleriniz şu anda pasif. Burada görmek için bazı ürünleri aktifleştirin.'
                    }
                  </p>
                  <Link href="/admin/products" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 inline-block">
                    {stats.totalProducts === 0 ? 'İlk Ürünü Ekle' : 'Ürünleri Yönet'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  {stats.recentProducts.length >= 5 && (
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}