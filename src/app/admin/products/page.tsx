"use client";

// import Link from "next/link";
import { useState, useEffect } from "react";
import { productApi, categoryApi } from "@/services/api";
import MediaUpload from "@/components/MediaUpload";
import MediaDisplay from "@/components/MediaDisplay";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import PriceTierManager from "@/components/PriceTierManager";

export default function AdminProducts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: 0,
    stock_quantity: 0,
    is_active: true
  });

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching products and categories...');
        
        // Test Supabase connection first
        console.log('Testing Supabase connection...');
        const { supabase } = await import('@/lib/supabaseClient');
        const { data: testData, error: testError } = await supabase.from('products').select('count').limit(1);
        console.log('Supabase test result:', { testData, testError });
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll()
        ]);
        
        console.log('Products response:', productsResponse);
        console.log('Categories response:', categoriesResponse);
        
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleProductStatus = async (id: number) => {
    console.log('Starting toggle for product ID:', id);
    setActionLoading(prev => ({ ...prev, [`status-${id}`]: true }));
    
    try {
      const product = products.find(p => p.id === id);
      if (!product) {
        console.error('Product not found:', id);
        return;
      }
      
      const newStatus = !product.is_active;
      console.log('Current status:', product.is_active, 'New status:', newStatus);
      
      console.log('Sending API request...');
      const response = await productApi.update(id, { ...product, is_active: newStatus });
      console.log('API response:', response);
      
      // Update local state - use response.data if available, otherwise use newStatus
      const updatedStatus = response.data ? response.data.is_active : newStatus;
      setProducts(products.map(p => 
        p.id === id ? { ...p, is_active: updatedStatus } : p
      ));
      
      // Show success toast
      (window as any).toast?.success(
        'Product Status Updated',
        `Product has been ${newStatus ? 'activated' : 'deactivated'} successfully`
      );
    } catch (err) {
      console.error('Error updating product status:', err);
      (window as any).toast?.error(
        'Update Failed',
        `Failed to update product status: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      console.log('Clearing loading state for product ID:', id);
      setActionLoading(prev => ({ ...prev, [`status-${id}`]: false }));
    }
  };

  const deleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setActionLoading(prev => ({ ...prev, [`delete-${id}`]: true }));
      
      try {
        await productApi.delete(id);
        
        // Update local state
        setProducts(products.filter(product => product.id !== id));
        
        // Show success toast
        (window as any).toast?.success(
          'Product Deleted',
          'Product has been deleted successfully'
        );
      } catch (err) {
        console.error('Error deleting product:', err);
        (window as any).toast?.error(
          'Delete Failed',
          'Failed to delete product. Please try again.'
        );
      } finally {
        setActionLoading(prev => ({ ...prev, [`delete-${id}`]: false }));
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      // Validate that category_id is selected
      if (newProduct.category_id === 0) {
        (window as any).toast?.warning(
          'Validation Error',
          'Please select a category'
        );
        return;
      }
      
      // Validate required fields
      if (!newProduct.name.trim()) {
        (window as any).toast?.warning(
          'Validation Error',
          'Product name is required'
        );
        return;
      }
      
      if (newProduct.price <= 0) {
        (window as any).toast?.warning(
          'Validation Error',
          'Product price must be greater than 0'
        );
        return;
      }
      
      const response = await productApi.create(newProduct);
      setProducts([...products, response.data]);
      setShowAddForm(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category_id: 0,
        stock_quantity: 0,
        is_active: true
      });
      
      // Show success toast
      (window as any).toast?.success(
        'Product Added',
        'Product has been added successfully'
      );
    } catch (err) {
      console.error('Error adding product:', err);
      (window as any).toast?.error(
        'Add Failed',
        'Failed to add product. Please try again.'
      );
    }
  };

  const handleMediaUpload = (media: any) => {
    console.log('Media uploaded:', media);
    // Media will be automatically saved to database by MediaUpload component
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setShowEditForm(true);
  };

  const handleEditProduct = async () => {
    try {
      if (!editingProduct) return;

      // Validate required fields
      if (!editingProduct.name.trim()) {
        (window as any).toast?.warning(
          'Validation Error',
          'Product name is required'
        );
        return;
      }
      
      if (editingProduct.price <= 0) {
        (window as any).toast?.warning(
          'Validation Error',
          'Product price must be greater than 0'
        );
        return;
      }

      if (editingProduct.category_id === 0) {
        (window as any).toast?.warning(
          'Validation Error',
          'Please select a category'
        );
        return;
      }

      const response = await productApi.update(editingProduct.id, editingProduct);
      
      // Update local state
      setProducts(products.map(p => 
        p.id === editingProduct.id ? response.data : p
      ));
      
      // Close modal
      setShowEditForm(false);
      setEditingProduct(null);
      
      // Show success toast
      (window as any).toast?.success(
        'Product Updated',
        'Product has been updated successfully'
      );
    } catch (err) {
      console.error('Error updating product:', err);
      (window as any).toast?.error(
        'Update Failed',
        'Failed to update product. Please try again.'
      );
    }
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingProduct(null);
  };

  // Filter products based on status
  const getFilteredProducts = () => {
    if (statusFilter === 'all') return products;
    if (statusFilter === 'active') return products.filter(p => p.is_active);
    if (statusFilter === 'inactive') return products.filter(p => !p.is_active);
    return products;
  };

  const handleMediaError = (error: string) => {
    alert('Media upload error: ' + error);
  };

  const openMediaModal = (product: any) => {
    setSelectedProduct(product);
    setShowMediaModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Ürünler yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-red-500">{error}</div>
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
          title="Ürünler" 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        >
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
          >
            Ürün Ekle
          </button>
        </AdminHeader>

        {/* Add Product Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Yeni Ürün Ekle</h3>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fiyat</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                    <select
                      value={newProduct.category_id}
                      onChange={(e) => setNewProduct({...newProduct, category_id: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="0">Kategori seçin</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stok Miktarı</label>
                    <input
                      type="number"
                      value={newProduct.stock_quantity || 0}
                      onChange={(e) => setNewProduct({...newProduct, stock_quantity: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ürün Ekle
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Ürünü Düzenle</h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    id="edit-description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₺</span>
                    <input
                      type="number"
                      id="edit-price"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    id="edit-category"
                    value={editingProduct.category_id}
                    onChange={(e) => setEditingProduct({...editingProduct, category_id: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                  >
                    <option value={0}>Kategori seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="edit-quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Stok Miktarı
                  </label>
                  <input
                    type="number"
                    id="edit-quantity"
                    value={editingProduct.stock_quantity || 0}
                    onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value) || 0})}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                    placeholder="0"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-2">
                    Resim URL
                  </label>
                  <input
                    type="url"
                    id="edit-image"
                    value={editingProduct.image_url || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 font-semibold text-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      id="edit-active"
                      type="checkbox"
                      checked={editingProduct.is_active}
                      onChange={(e) => setEditingProduct({...editingProduct, is_active: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit-active" className="ml-2 block text-sm text-gray-900">
                      Ürün aktif
                    </label>
                  </div>
                </div>

                {/* Price Tiers Management */}
                <div className="md:col-span-2">
                  <div className="border-t border-gray-200 pt-6">
                    <PriceTierManager
                      productId={editingProduct.id}
                      basePrice={editingProduct.price}
                      onTiersChange={(tiers) => {
                        // Update has_price_tiers status
                        const hasPriceTiers = tiers && tiers.length > 0;
                        setEditingProduct({...editingProduct, has_price_tiers: hasPriceTiers});
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProduct}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                >
                  Ürünü Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Management Modal */}
        {showMediaModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Medya Yönetimi - {selectedProduct.name}
                  </h3>
                  <button 
                    onClick={() => setShowMediaModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Yeni Medya Yükle</h4>
                    <MediaUpload
                      productId={selectedProduct.id.toString()}
                      onUploadComplete={handleMediaUpload}
                      onUploadError={handleMediaError}
                    />
                  </div>
                  
                  {/* Existing Media */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Mevcut Medya</h4>
                    <MediaDisplay 
                      productId={selectedProduct.id.toString()}
                      className="max-h-96 overflow-y-auto"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowMediaModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Content */}
        <main className="p-6">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürünleri ara..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ürün</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fiyat</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Eylemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {getFilteredProducts().map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.image_url ? (
                              <img 
                                className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200" 
                                src={product.image_url} 
                                alt={product.name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className={`h-12 w-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center ${product.image_url ? 'hidden' : 'flex'}`}
                            >
                              <span className="text-white font-bold text-lg">
                                {product.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {product.description || 'Açıklama yok'}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-400">ID: {product.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {categories.find(cat => cat.id === product.category_id)?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-lg font-bold text-gray-900">₺{Math.round(product.price || 0)}</div>
                          <div className="text-xs text-gray-500">TL</div>
                          {product.has_price_tiers && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Toptan Fiyat
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <div className="text-lg font-semibold text-gray-900">{product.stock_quantity || 0}</div>
                            <div className="text-xs text-gray-500 ml-1">adet</div>
                          </div>
                          {(product.stock_quantity || 0) === 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Stokta Yok
                            </span>
                          )}
                          {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) < 10 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Düşük Stok
                            </span>
                          )}
                          {(product.stock_quantity || 0) >= 10 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Stokta Var
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                          ${product.is_active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                          }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            product.is_active ? "bg-green-400" : "bg-red-400"
                          }`}></div>
                          {product.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {/* Edit Button */}
                          <button 
                            title="Ürünü Düzenle"
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Düzenle
                          </button>
                          
                          {/* Media Button */}
                          <button 
                            title="Medya Yönetimi"
                            onClick={() => openMediaModal(product)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-green-700 bg-green-100 hover:bg-green-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Medya
                          </button>
                          
                          {/* Status Toggle Button */}
                          <button 
                            title={product.is_active ? "Ürünü Pasifleştir" : "Ürünü Aktifleştir"}
                            onClick={() => toggleProductStatus(product.id)}
                            disabled={actionLoading[`status-${product.id}`]}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                              product.is_active 
                                ? "text-orange-700 bg-orange-100 hover:bg-orange-200 focus:ring-orange-500" 
                                : "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500"
                            }`}
                          >
                            {actionLoading[`status-${product.id}`] ? (
                              <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {product.is_active ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                )}
                              </svg>
                            )}
                            {actionLoading[`status-${product.id}`] ? "Güncelleniyor..." : (product.is_active ? "Pasifleştir" : "Aktifleştir")}
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            title="Ürünü Sil"
                            onClick={() => deleteProduct(product.id)}
                            disabled={actionLoading[`delete-${product.id}`]}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {actionLoading[`delete-${product.id}`] ? (
                              <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            {actionLoading[`delete-${product.id}`] ? "Siliniyor..." : "Sil"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Önceki
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  Sonraki
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">1</span> ile <span className="font-semibold text-gray-900">{getFilteredProducts().length}</span> arası gösteriliyor, toplam{' '}
                        <span className="font-semibold text-gray-900">{getFilteredProducts().length}</span> sonuç
                      </p>
                    </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200">
                      <span className="sr-only">Önceki</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-orange-50 text-sm font-medium text-orange-600 border-orange-300">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200">
                      <span className="sr-only">Sonraki</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}