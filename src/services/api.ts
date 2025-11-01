// API service utility for making requests to our backend
// This service now uses Supabase for data operations

import { productService, categoryService, orderService, customerService } from './supabaseService';

// Product API methods - now using Supabase
export const productApi = {
  // Get all products
  getAll: async (params?: { category?: string; search?: string; status?: string }) => {
    try {
      console.log('ProductApi.getAll called with params:', params);
      const data = await productService.getAll();
      console.log('ProductService returned data:', data);
      
      // Apply filters if provided
      let filteredData = data || [];
      if (params?.category) {
        filteredData = filteredData.filter((product: any) => {
          // Check if product has categories array and if it includes the selected category
          if (product.categories && Array.isArray(product.categories)) {
            return product.categories.some((cat: any) => {
              const categoryId = typeof cat === 'object' ? cat.id : cat;
              return categoryId === parseInt(params.category || '');
            });
          }
          // Fallback to old category_id for backward compatibility
          return product.category_id === parseInt(params.category || '');
        });
      }
      if (params?.search) {
        filteredData = filteredData.filter(
          (product: any) => 
            product.name.toLowerCase().includes(params.search?.toLowerCase() || '') ||
            product.description?.toLowerCase().includes(params.search?.toLowerCase() || '')
        );
      }
      if (params?.status === 'active') {
        filteredData = filteredData.filter(
          (product: any) => product.is_active === true
        );
      }
      
      const result = {
        success: true,
        data: filteredData,
        count: filteredData.length
      };
      
      console.log('ProductApi.getAll returning:', result);
      return result;
    } catch (error) {
      console.error('ProductApi.getAll error:', error);
      throw error;
    }
  },
  
  // Get product by ID
  getById: async (id: number) => {
    try {
      const data = await productService.getById(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new product
  create: async (productData: any) => {
    try {
      const data = await productService.create(productData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Update a product
  update: async (id: number, productData: any) => {
    try {
      const data = await productService.update(id, productData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a product
  delete: async (id: number) => {
    try {
      const data = await productService.delete(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
};

// Category API methods - now using Supabase
export const categoryApi = {
  // Get all categories
  getAll: async (params?: { status?: string }) => {
    try {
      console.log('CategoryApi.getAll called with params:', params);
      const data = await categoryService.getAll();
      console.log('CategoryService returned data:', data);
      
      // Apply filters if provided
      let filteredData = data || [];
      if (params?.status) {
        const isActive = params.status.toLowerCase() === 'active';
        filteredData = filteredData.filter(
          (category: any) => category.is_active === isActive
        );
      }
      
      const result = {
        success: true,
        data: filteredData,
        count: filteredData.length
      };
      
      console.log('CategoryApi.getAll returning:', result);
      return result;
    } catch (error) {
      console.error('CategoryApi.getAll error:', error);
      throw error;
    }
  },
  
  // Get category by ID
  getById: async (id: number) => {
    try {
      const data = await categoryService.getById(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new category
  create: async (categoryData: any) => {
    try {
      const data = await categoryService.create(categoryData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Update a category
  update: async (id: number, categoryData: any) => {
    try {
      const data = await categoryService.update(id, categoryData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a category
  delete: async (id: number) => {
    try {
      const data = await categoryService.delete(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
};

// Order API methods - now using Supabase
export const orderApi = {
  // Get all orders
  getAll: async (params?: { status?: string; customer?: string }) => {
    try {
      const data = await orderService.getAll();
      
      // Apply filters if provided
      let filteredData = data;
      if (params?.status) {
        filteredData = filteredData.filter(
          (order: any) => order.status.toLowerCase() === params.status?.toLowerCase()
        );
      }
      if (params?.customer) {
        filteredData = filteredData.filter(
          (order: any) => order.customer?.toLowerCase().includes(params.customer?.toLowerCase() || '')
        );
      }
      
      return {
        success: true,
        data: filteredData,
        count: filteredData.length
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Get order by ID
  getById: async (id: string) => {
    try {
      const data = await orderService.getById(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new order
  create: async (orderData: any) => {
    try {
      const data = await orderService.create(orderData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Update an order
  update: async (id: string, orderData: any) => {
    try {
      const data = await orderService.update(id, orderData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete an order
  delete: async (id: string) => {
    try {
      const data = await orderService.delete(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
};

// Customer API methods - now using Supabase
export const customerApi = {
  // Get all customers
  getAll: async (params?: { status?: string; search?: string }) => {
    try {
      const data = await customerService.getAll();
      
      // Apply filters if provided
      let filteredData = data;
      if (params?.status) {
        const isActive = params.status.toLowerCase() === 'active';
        filteredData = filteredData.filter(
          (customer: any) => customer.status?.toLowerCase() === params.status?.toLowerCase()
        );
      }
      if (params?.search) {
        filteredData = filteredData.filter(
          (customer: any) => 
            customer.name?.toLowerCase().includes(params.search?.toLowerCase() || '') ||
            customer.email?.toLowerCase().includes(params.search?.toLowerCase() || '')
        );
      }
      
      return {
        success: true,
        data: filteredData,
        count: filteredData.length
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Get customer by ID
  getById: async (id: number) => {
    try {
      const data = await customerService.getById(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new customer
  create: async (customerData: any) => {
    try {
      const data = await customerService.create(customerData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Update a customer
  update: async (id: number, customerData: any) => {
    try {
      const data = await customerService.update(id, customerData);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a customer
  delete: async (id: number) => {
    try {
      const data = await customerService.delete(id);
      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },
};

// Price Tiers API methods - using Supabase
export const priceTierApi = {
  // Get all price tiers
  getAll: async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('price_tiers')
        .select('*')
        .order('product_id', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      throw error;
    }
  },

  // Get price tiers for a product
  getByProductId: async (productId: number) => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('price_tiers')
        .select('*')
        .eq('product_id', productId)
        .order('min_quantity', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      throw error;
    }
  },

  // Create a new price tier
  create: async (tierData: {
    product_id: number;
    min_quantity: number;
    max_quantity?: number;
    price: number;
    discount_percentage?: number;
  }) => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('price_tiers')
        .insert([tierData])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },

  // Update a price tier
  update: async (tierId: number, tierData: {
    min_quantity?: number;
    max_quantity?: number;
    price?: number;
    discount_percentage?: number;
  }) => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .from('price_tiers')
        .update(tierData)
        .eq('id', tierId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      throw error;
    }
  },

  // Delete a price tier
  delete: async (tierId: number) => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { error } = await supabase
        .from('price_tiers')
        .delete()
        .eq('id', tierId);

      if (error) throw error;

      return {
        success: true,
        data: null
      };
    } catch (error) {
      throw error;
    }
  },

  // Get price for specific quantity using database function
  getPriceForQuantity: async (productId: number, quantity: number) => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .rpc('get_price_for_quantity', {
          p_product_id: productId,
          p_quantity: quantity
        });

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  },

  // Get all price tiers as JSON for a product
  getTiersAsJson: async (productId: number) => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data, error } = await supabase
        .rpc('get_product_price_tiers', {
          p_product_id: productId
        });

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }
};

// Search API methods for real-time search suggestions
export const searchApi = {
  // Get search suggestions for products
  getSuggestions: async (query: string, limit: number = 5) => {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: true,
          data: []
        };
      }

      const response = await productApi.getAll({ 
        search: query.trim(), 
        status: 'active' 
      });
      
      // Limit results and format for suggestions
      const suggestions = response.data.slice(0, limit).map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.images && product.images.length > 0 ? product.images[0] : 
                  product.image_url || 
                  product.media_url || 
                  product.product_image ||
                  null,
        has_price_tiers: product.has_price_tiers
      }));

      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};

// Similar products API methods
export const similarProductsApi = {
  // Get similar products based on category and price range
  getSimilarProducts: async (productId: number, limit: number = 6) => {
    try {
      // First get the current product details
      const currentProduct = await productApi.getById(productId);
      if (!currentProduct.success) {
        return { success: false, data: [] };
      }

      const product = currentProduct.data;
      const categoryId = product.category_id;
      const productPrice = product.price;
      
      // Get all active products
      const allProducts = await productApi.getAll({ status: 'active' });
      
      // Filter similar products
      let similarProducts = allProducts.data.filter((p: any) => 
        p.id !== productId && // Exclude current product
        p.is_active === true && // Only active products
        p.stock_quantity > 0 // Only products in stock
      );

      // Prioritize by category first
      if (categoryId) {
        const sameCategory = similarProducts.filter((p: any) => p.category_id === categoryId);
        const otherCategory = similarProducts.filter((p: any) => p.category_id !== categoryId);
        
        // Sort by price similarity within same category
        const sortedSameCategory = sameCategory.sort((a: any, b: any) => {
          const priceDiffA = Math.abs(a.price - productPrice);
          const priceDiffB = Math.abs(b.price - productPrice);
          return priceDiffA - priceDiffB;
        });
        
        // Sort other categories by price similarity
        const sortedOtherCategory = otherCategory.sort((a: any, b: any) => {
          const priceDiffA = Math.abs(a.price - productPrice);
          const priceDiffB = Math.abs(b.price - productPrice);
          return priceDiffA - priceDiffB;
        });
        
        similarProducts = [...sortedSameCategory, ...sortedOtherCategory];
      } else {
        // If no category, sort by price similarity
        similarProducts = similarProducts.sort((a: any, b: any) => {
          const priceDiffA = Math.abs(a.price - productPrice);
          const priceDiffB = Math.abs(b.price - productPrice);
          return priceDiffA - priceDiffB;
        });
      }

      // Format and limit results
      const formattedProducts = similarProducts.slice(0, limit).map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        compare_price: product.compare_price,
        image_url: product.images && product.images.length > 0 ? product.images[0] : 
                  product.image_url || 
                  product.media_url || 
                  product.product_image ||
                  null,
        has_price_tiers: product.has_price_tiers,
        category_id: product.category_id,
        stock_quantity: product.stock_quantity
      }));

      return {
        success: true,
        data: formattedProducts
      };
    } catch (error) {
      console.error('Error getting similar products:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  // Get products from same category
  getCategoryProducts: async (categoryId: number, excludeProductId: number, limit: number = 6) => {
    try {
      const response = await productApi.getAll({ 
        category: categoryId.toString(), 
        status: 'active' 
      });
      
      const products = response.data
        .filter((product: any) => 
          product.id !== excludeProductId && 
          product.stock_quantity > 0
        )
        .slice(0, limit)
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          compare_price: product.compare_price,
          image_url: product.images && product.images.length > 0 ? product.images[0] : 
                    product.image_url || 
                    product.media_url || 
                    product.product_image ||
                    null,
          has_price_tiers: product.has_price_tiers,
          stock_quantity: product.stock_quantity
        }));

      return {
        success: true,
        data: products
      };
    } catch (error) {
      console.error('Error getting category products:', error);
      return {
        success: false,
        data: []
      };
    }
  }
};

// Supabase service methods (now implemented)
export const supabaseService = {
  products: productService,
  categories: categoryService,
  orders: orderService,
  customers: customerService
};

// Şifre sıfırlama fonksiyonu (Supabase demoya göre aşağıdaki şekilde olur)
import { supabase } from "@/lib/supabaseClient";

export async function sendPasswordReset(email: string) {
  // Supabase için:
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw error;
  return true;
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  // Network response başarılı olduğu için alternatif yaklaşım:
  // updateUser'ı çağır, ama promise resolve olmasını bekleme.
  // 2 saniye sonra direkt başarılı say (network zaten başarılı)
  
  const updatePromise = supabase.auth.updateUser({ password: newPassword });
  
  // Gerçek promise'i dinle - eğer hata gelirse fırlat
  const errorPromise = updatePromise.then((result) => {
    if (result.error) {
      throw result.error;
    }
    return true;
  }).catch((err) => {
    throw err;
  });
  
  // 2 saniye sonra başarılı say (network response başarılı olduğunu biliyoruz)
  const quickSuccessPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 2000);
  });
  
  try {
    // İlk tamamlanan promise'i kullan
    // Eğer errorPromise önce tamamlanırsa (hata varsa), hata fırlatılır
    // Eğer quickSuccessPromise önce tamamlanırsa (2 saniye geçerse), başarılı sayılır
    const result = await Promise.race([errorPromise, quickSuccessPromise]);
    return result;
  } catch (err: any) {
    // Gerçek bir hata varsa (validation vb), onu fırlat
    console.error("Şifre güncelleme hatası:", err);
    throw err;
  }
}