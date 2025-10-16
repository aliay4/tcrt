"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryApi } from "@/services/api";
import MediaDisplay from "@/components/MediaDisplay";

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll({ status: 'active' });
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Kategoriye Göre Alışveriş</h1>
          <p className="text-xl text-white/90">
            Geniş ürün kategorilerimizi keşfedin
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Kategori Yok</h3>
              <p className="text-gray-500">Kategoriler eklendiğinde burada görünecek.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
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
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <span>Keşfet</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
