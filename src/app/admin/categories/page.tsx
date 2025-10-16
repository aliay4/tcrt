"use client";

// import Link from "next/link";
import { useState, useEffect } from "react";
import { categoryApi } from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import MediaUpload from "@/components/MediaUpload";
import MediaDisplay from "@/components/MediaDisplay";

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export default function AdminCategories() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    is_active: true
  });
  
  // Filtreleme ve arama durumları
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Kategoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCategories = () => {
    let filtered = [...categories];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Durum filtresi
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(category => category.is_active === isActive);
    }

    // Sıralama
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "created_at":
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case "product_count":
          aValue = a.product_count || 0;
          bValue = b.product_count || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredCategories(filtered);
    setCurrentPage(1); // Filtreleme sonrası ilk sayfaya dön
  };

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data before submit:', formData);
    console.log('Image URL specifically:', formData.image_url);
    
    // Eğer image_url boşsa uyarı ver
    if (!formData.image_url || formData.image_url.trim() === '') {
      console.warn('Image URL is empty! FormData:', formData);
    }
    
    try {
      if (editingCategory) {
        // Update existing category
        const response = await categoryApi.update(editingCategory.id, formData);
        setCategories(categories.map(cat => cat.id === editingCategory.id ? response.data : cat));
        (window as any).toast?.success(
          'Kategori Güncellendi',
          'Kategori başarıyla güncellendi'
        );
      } else {
        // Create new category
        const response = await categoryApi.create(formData);
        setCategories([...categories, response.data]);
        (window as any).toast?.success(
          'Kategori Eklendi',
          'Kategori başarıyla eklendi'
        );
      }
      
      cancelForm();
    } catch (error) {
      console.error('Error saving category:', error);
      (window as any).toast?.error(
        'Kayıt Başarısız',
        'Kategori kaydedilemedi. Lütfen tekrar deneyin.'
      );
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await categoryApi.delete(id);
        setCategories(categories.filter(cat => cat.id !== id));
        (window as any).toast?.success(
          'Kategori Silindi',
          'Kategori başarıyla silindi'
        );
      } catch (error) {
        console.error('Error deleting category:', error);
        (window as any).toast?.error(
          'Silme Başarısız',
          'Kategori silinemedi. Lütfen tekrar deneyin.'
        );
      }
    }
  };

  const toggleCategoryStatus = async (category: Category) => {
    try {
      const response = await categoryApi.update(category.id, { ...category, is_active: !category.is_active });
      setCategories(categories.map(cat => cat.id === category.id ? response.data : cat));
      (window as any).toast?.success(
        'Kategori Durumu Güncellendi',
        `Kategori başarıyla ${!category.is_active ? 'aktifleştirildi' : 'pasifleştirildi'}`
      );
    } catch (error) {
      console.error('Error updating category status:', error);
      (window as any).toast?.error(
        'Güncelleme Başarısız',
        'Kategori durumu güncellenemedi. Lütfen tekrar deneyin.'
      );
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const cancelForm = () => {
    setFormData({ name: "", description: "", image_url: "", is_active: true });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleMediaUpload = (mediaUrl: string) => {
    console.log('Media upload completed, URL:', mediaUrl);
    
    // FormData'yı güncelle
    const updatedFormData = { ...formData, image_url: mediaUrl };
    setFormData(updatedFormData);
    
    console.log('Updated formData immediately:', updatedFormData);
    
    setShowMediaModal(false);
    (window as any).toast?.success(
      'Resim Yüklendi',
      'Kategori resmi başarıyla yüklendi'
    );
  };

  const handleMediaUploadError = (error: string) => {
    console.error('Media upload error:', error);
    (window as any).toast?.error(
      'Yükleme Hatası',
      error
    );
  };

  const openMediaModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active
    });
    setShowMediaModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Kategoriler yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <AdminHeader 
          title="Kategoriler" 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        >
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
          >
            Kategori Ekle
          </button>
        </AdminHeader>

        {/* Media Upload Modal */}
        {showMediaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Kategori Resmi Yönetimi
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCategory?.name} kategorisi için resim yükleyin veya mevcut resmi görüntüleyin
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowMediaModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Mevcut Resim */}
                  {formData.image_url && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Mevcut Resim</h4>
                      <MediaDisplay 
                        mediaUrl={formData.image_url}
                        alt={selectedCategory?.name || 'Kategori resmi'}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  
                  {/* Resim Yükleme */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {formData.image_url ? 'Yeni Resim Yükle' : 'Resim Yükle'}
                    </h4>
                    <MediaUpload
                      productId="category"
                      onUpload={handleMediaUpload}
                      onUploadError={handleMediaUploadError}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Resim URL Manuel Giriş */}
                  <div>
                    <label htmlFor="manual_image_url" className="block text-sm font-bold text-gray-700 mb-2">
                      Veya Resim URL'si Girin
                    </label>
                    <input
                      id="manual_image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => {
                        console.log('Manual URL change:', e.target.value);
                        setFormData(prev => ({...prev, image_url: e.target.value}));
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                      placeholder="https://example.com/kategori-resmi.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Category Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingCategory ? 'Kategori bilgilerini güncelleyin' : 'Yeni kategori bilgilerini girin'}
                    </p>
                  </div>
                  <button 
                    onClick={cancelForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Kategori Adı */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Kategori Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                      placeholder="Örn: Elektronik, Giyim, Ev & Yaşam"
                      required
                    />
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none font-semibold text-gray-900"
                      placeholder="Bu kategoriye ait açıklama yazın (isteğe bağlı)"
                    />
                  </div>

                  {/* Resim Yönetimi */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Kategori Resmi
                    </label>
                    <div className="space-y-3">
                      {/* Resim Yükleme Butonu */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(editingCategory);
                          setShowMediaModal(true);
                        }}
                        className="w-full px-4 py-3 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors duration-200 text-orange-600 font-semibold"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Resim Yükle</span>
                        </div>
                      </button>
                      
                      {/* Manuel URL Girişi */}
                      <div>
                        <label htmlFor="image_url" className="block text-xs font-medium text-gray-600 mb-1">
                          Veya URL Girin
                        </label>
                        <input
                          id="image_url"
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => {
                            console.log('Form URL change:', e.target.value);
                            setFormData(prev => ({...prev, image_url: e.target.value}));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-sm"
                          placeholder="https://example.com/kategori-resmi.jpg"
                        />
                      </div>
                      
                      {/* Resim Önizleme */}
                      {formData.image_url && (
                        <div className="mt-2">
                          <MediaDisplay 
                            mediaUrl={formData.image_url}
                            alt="Kategori önizleme"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Durum */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-colors duration-200"
                      />
                      <label htmlFor="is_active" className="ml-3 block text-sm font-bold text-gray-900">
                        Kategori aktif
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-7">
                      Aktif kategoriler müşteriler tarafından görülebilir
                    </p>
                  </div>

                  {/* Butonlar */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                    >
                      {editingCategory ? 'Güncelle' : 'Kategori Ekle'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Categories Content */}
        <main className="p-6">
          {/* Filtreleme ve Arama Bölümü */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Arama */}
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-bold text-gray-700 mb-2">
                  Kategori Ara
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Kategori adı veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 font-semibold text-gray-900"
                  />
                </div>
              </div>

              {/* Durum Filtresi */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-bold text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 font-semibold text-gray-900"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <label htmlFor="sort" className="block text-sm font-bold text-gray-700 mb-2">
                  Sırala
                </label>
                <select
                  id="sort"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [column, order] = e.target.value.split('-');
                    setSortBy(column);
                    setSortOrder(order as "asc" | "desc");
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 font-semibold text-gray-900"
                >
                  <option value="name-asc">Ad (A-Z)</option>
                  <option value="name-desc">Ad (Z-A)</option>
                  <option value="created_at-desc">En Yeni</option>
                  <option value="created_at-asc">En Eski</option>
                </select>
              </div>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Toplam Kategori</p>
                  <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Aktif Kategori</p>
                  <p className="text-2xl font-semibold text-gray-900">{categories.filter(c => c.is_active).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pasif Kategori</p>
                  <p className="text-2xl font-semibold text-gray-900">{categories.filter(c => !c.is_active).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Filtrelenen</p>
                  <p className="text-2xl font-semibold text-gray-900">{filteredCategories.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kategoriler Tablosu */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Kategori</span>
                        {sortBy === "name" && (
                          <svg className={`h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("product_count")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Ürün Sayısı</span>
                        {sortBy === "product_count" && (
                          <svg className={`h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Oluşturulma</span>
                        {sortBy === "created_at" && (
                          <svg className={`h-4 w-4 ${sortOrder === "asc" ? "transform rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eylemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">Kategori bulunamadı</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || statusFilter !== "all" 
                              ? "Arama kriterlerinize uygun kategori bulunamadı." 
                              : "Henüz kategori eklenmemiş."
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {category.image_url ? (
                                <img className="h-10 w-10 rounded-lg object-cover" src={category.image_url} alt={category.name} />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">{category.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                              <div className="text-sm text-gray-500">ID: {category.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {category.description ? (
                              <span className="truncate">{category.description}</span>
                            ) : (
                              <span className="text-gray-400 italic">Açıklama yok</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.product_count || 0} ürün
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${category.is_active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              category.is_active ? "bg-green-400" : "bg-red-400"
                            }`}></span>
                            {category.is_active ? "Aktif" : "Pasif"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.created_at ? new Date(category.created_at).toLocaleDateString('tr-TR') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-orange-600 hover:text-orange-900 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50"
                              title="Düzenle"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openMediaModal(category)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                              title="Resim Yönetimi"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => toggleCategoryStatus(category)}
                              className={`transition-colors duration-200 p-2 rounded-lg ${
                                category.is_active 
                                  ? "text-red-600 hover:text-red-900 hover:bg-red-50" 
                                  : "text-green-600 hover:text-green-900 hover:bg-green-50"
                              }`}
                              title={category.is_active ? "Pasifleştir" : "Aktifleştir"}
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {category.is_active ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                              title="Sil"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredCategories.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{startIndex + 1}</span> ile <span className="font-medium">{Math.min(endIndex, filteredCategories.length)}</span> arası gösteriliyor, toplam{' '}
                      <span className="font-medium">{filteredCategories.length}</span> sonuç
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Önceki</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Sayfa numaraları */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                        }
                        return null;
                      })}
                      
                      <button 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Sonraki</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}