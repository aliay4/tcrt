"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { categoryApi, searchApi } from "@/services/api";
import MediaDisplay from "@/components/MediaDisplay";

export default function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { cartCount } = useCart();

  // Admin panelinde olup olmadığımızı kontrol et
  const isAdminPanel = pathname.startsWith('/admin');

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryApi.getAll({ status: 'active' });
        setCategories(response.data); // Tüm kategoriler
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Ana sayfa her zaman sabit kalacak
  const homeLink = { name: "Ana Sayfa", href: "/" };

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setSearchLoading(true);
        try {
          const response = await searchApi.getSuggestions(searchQuery.trim(), 5);
          setSearchSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error loading search suggestions:', error);
          setSearchSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      // Redirect to search page with query parameter
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSuggestionClick = (productId: number) => {
    setShowSuggestions(false);
    setSearchQuery("");
    window.location.href = `/products/${productId}`;
  };

  const handleInputFocus = () => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Image
                src="/ikon.svg"
                alt="Yüksel Ticaret Logo"
                width={75}
                height={75}
                className="mr-2 md:mr-3 group-hover:scale-105 transition-transform duration-300 h-12 w-12 md:h-[75px] md:w-[75px]"
              />
              <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300 truncate">
                Yüksel Ticaret
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-8 max-w-2xl">
            <form onSubmit={handleSearch} className="w-full flex relative">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Ürün, marka ve daha fazlasını arayın..."
                  className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 mt-1 max-h-80 overflow-y-auto">
                    {searchSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion.id)}
                        className="flex items-center p-3 hover:bg-orange-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                          {suggestion.image_url ? (
                            <MediaDisplay 
                              mediaUrl={suggestion.image_url}
                              alt={suggestion.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {suggestion.name}
                          </div>
                          <div className="text-sm text-orange-600 font-semibold">
                            ₺{Math.round(suggestion.price)}
                            {suggestion.has_price_tiers && (
                              <span className="text-xs text-gray-500 ml-1">(Toptan fiyat mevcut)</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-r-xl transition-all duration-300 font-semibold hover:scale-105 shadow-lg"
              >
                Ara
              </button>
            </form>
          </div>

          {/* User Actions - Desktop Only */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-gray-700 hover:text-orange-600 focus:outline-none p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 group-hover:scale-110 transition-transform duration-300">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="mr-2 font-medium">{user.email?.split('@')[0]}</span>
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">Tekrar hoş geldiniz!</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profilim
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Yönetici Paneli
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={async () => {
                          try {
                            setShowUserMenu(false);
                            await signOut();
                          } catch (error) {
                            console.error('Sign out error:', error);
                            // Show error message to user
                            alert('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
                          }
                        }}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-gray-700 hover:text-orange-600 flex items-center p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group">
                <svg className="w-5 h-5 md:mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium hidden sm:inline">Giriş Yap</span>
              </Link>
            )}
            <Link href="/favorites" className="text-gray-700 hover:text-orange-600 flex items-center p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-orange-600 flex items-center relative p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile User Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Sepet */}
            <Link href="/cart" className="text-gray-700 hover:text-orange-600 flex items-center relative p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Favoriler - Sepete yakın */}
            <Link href="/favorites" className="text-gray-700 hover:text-orange-600 flex items-center p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            
            {/* Profil/Giriş */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-gray-700 hover:text-orange-600 focus:outline-none p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">Tekrar hoş geldiniz!</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profilim
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Yönetici Paneli
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={async () => {
                          try {
                            setShowUserMenu(false);
                            await signOut();
                          } catch (error) {
                            console.error('Sign out error:', error);
                            alert('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
                          }
                        }}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="text-gray-700 hover:text-orange-600 flex items-center p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mb-3">
          <form onSubmit={handleSearch} className="flex relative">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Ürün, marka arayın..."
                className="w-full px-3 py-2.5 pl-10 pr-4 text-sm border-2 border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                ) : (
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              
              {/* Search Suggestions Dropdown - Mobile */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.id)}
                      className="flex items-center p-3 hover:bg-orange-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                        {suggestion.image_url ? (
                          <MediaDisplay
                            mediaUrl={suggestion.image_url}
                            alt={suggestion.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">
                          {suggestion.name}
                        </div>
                        <div className="text-xs text-orange-600 font-semibold">
                          ₺{Math.round(suggestion.price)}
                          {suggestion.has_price_tiers && (
                            <span className="text-xs text-gray-500 ml-1">(Toptan)</span>
                          )}
                        </div>
                      </div>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2.5 rounded-r-xl transition-all duration-300 font-semibold hover:scale-105 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Mobile Category Navigation - Admin panelinde gizle */}
        {!isAdminPanel && (
          <div className="md:hidden mb-3">
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {/* Ana Sayfa - Her zaman sabit */}
              <Link
                href="/"
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                  pathname === "/"
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 hover:shadow-md border border-gray-200"
                }`}
              >
                🏠 Ana Sayfa
              </Link>

              {/* Tüm Ürünler - Her zaman sabit */}
              <Link
                href="/products"
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                  pathname === "/products"
                    ? "bg-orange-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md border border-gray-200"
                }`}
              >
                📦 Tüm Ürünler
              </Link>

              {categoriesLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ))
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                      pathname === `/categories/${category.id}`
                        ? "bg-orange-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Category Navigation - Admin panelinde gizle */}
        {!isAdminPanel && (
          <div className="hidden md:block border-t border-gray-200 py-4">
            <div className="flex space-x-3 overflow-x-auto">
              {/* Ana Sayfa - Her zaman sabit */}
              <Link
                key={homeLink.name}
                href={homeLink.href}
                className={`${
                  pathname === homeLink.href
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md border border-gray-200"
                } px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95`}
              >
                {homeLink.name}
              </Link>

              {/* Tüm Ürünler - Her zaman sabit */}
              <Link
                href="/products"
                className={`${
                  pathname === "/products"
                    ? "bg-orange-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md border border-gray-200"
                } px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95`}
              >
                Tüm Ürünler
              </Link>
              
              {/* Dinamik Kategoriler */}
              {categoriesLoading ? (
                // Loading skeleton for categories
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse px-5 py-2.5 rounded-xl h-10 w-24"
                  ></div>
                ))
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className={`${
                      pathname === `/categories/${category.id}`
                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md border border-gray-200"
                    } px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95`}
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>

    </header>
  );
}