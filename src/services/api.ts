// API service utility for making requests to our backend
// This service now uses Supabase for data operations

import { productService, categoryService, orderService, customerService } from './supabaseService';

// Product API methods - now using Supabase
export const productApi = {
  // Get all products
  getAll: async (params?: { category?: string; search?: string; status?: string }) => {
    try {
      const data = await productService.getAll();
      
      // Apply filters if provided
      let filteredData = data;
      if (params?.category) {
        filteredData = filteredData.filter(
          (product: any) => product.category_id === parseInt(params.category || '')
        );
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
      
      return {
        success: true,
        data: filteredData,
        count: filteredData.length
      };
    } catch (error) {
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
      const data = await categoryService.getAll();
      
      // Apply filters if provided
      let filteredData = data;
      if (params?.status) {
        const isActive = params.status.toLowerCase() === 'active';
        filteredData = filteredData.filter(
          (category: any) => category.is_active === isActive
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

// Supabase service methods (now implemented)
export const supabaseService = {
  products: productService,
  categories: categoryService,
  orders: orderService,
  customers: customerService
};