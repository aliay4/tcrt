import { supabase } from '@/lib/supabaseClient';

// Product service
export const productService = {
  // Get all products
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  // Get product by ID
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new product
  create: async (productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a product
  update: async (id: number, productData: any) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete a product
  delete: async (id: number) => {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  },
};

// Category service
export const categoryService = {
  // Get all categories
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  // Get category by ID
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new category
  create: async (categoryData: any) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a category
  update: async (id: number, categoryData: any) => {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete a category
  delete: async (id: number) => {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  },
};

// Order service
export const orderService = {
  // Get all orders
  getAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  // Get order by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new order
  create: async (orderData: any) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update an order
  update: async (id: string, orderData: any) => {
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete an order
  delete: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  },
};

// Customer service
export const customerService = {
  // Get all customers
  getAll: async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  // Get customer by ID
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new customer
  create: async (customerData: any) => {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a customer
  update: async (id: number, customerData: any) => {
    const { data, error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete a customer
  delete: async (id: number) => {
    const { data, error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  },
};