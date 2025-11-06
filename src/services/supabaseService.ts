import { supabase } from "@/lib/supabaseClient";

// Product service
export const productService = {
  // Get all products with categories
  getAll: async () => {
    try {
      // First get all products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) {
        console.error("Supabase products error:", productsError);
        throw new Error(`Failed to fetch products: ${productsError.message}`);
      }

      // Then get all product-category relationships
      const { data: productCategories, error: pcError } = await supabase.from(
        "product_categories",
      ).select(`
          product_id,
          category_id,
          categories(
            id,
            name,
            description,
            is_active
          )
        `);

      if (pcError) {
        console.error("Supabase product_categories error:", pcError);
        throw new Error(
          `Failed to fetch product categories: ${pcError.message}`,
        );
      }

      // Transform data to include categories array
      const transformedData = (products || []).map((product) => {
        const productCats =
          productCategories?.filter((pc) => pc.product_id === product.id) || [];
        return {
          ...product,
          categories: productCats.map((pc) => pc.categories).filter(Boolean),
        };
      });

      return transformedData;
    } catch (error) {
      console.error("ProductService getAll error:", error);
      throw error;
    }
  },

  // Get product by ID with categories
  getById: async (id: number) => {
    // First get the product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (productError) throw productError;

    // Then get product categories
    const { data: productCategories, error: pcError } = await supabase
      .from("product_categories")
      .select(
        `
        category_id,
        categories(
          id,
          name,
          description,
          is_active
        )
      `,
      )
      .eq("product_id", id);

    if (pcError) throw pcError;

    // Transform data to include categories array
    return {
      ...product,
      categories:
        productCategories?.map((pc) => pc.categories).filter(Boolean) || [],
    };
  },

  // Create a new product with categories
  create: async (productData: any) => {
    const { categories, ...productInfo } = productData;

    // Create the product first - set category_id to null since we use product_categories table
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([{ ...productInfo, category_id: null }])
      .select()
      .single();

    if (productError) throw productError;

    // Add categories if provided
    if (categories && categories.length > 0) {
      const categoryInserts = categories.map((categoryId: number) => ({
        product_id: product.id,
        category_id: categoryId,
      }));

      const { error: categoryError } = await supabase
        .from("product_categories")
        .insert(categoryInserts);

      if (categoryError) throw categoryError;
    }

    return product;
  },

  // Update a product with categories
  update: async (id: number, productData: any) => {
    const { categories, ...productInfo } = productData;

    // Update the product
    const { data, error } = await supabase
      .from("products")
      .update(productInfo)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update categories ONLY if explicitly provided (not undefined)
    // categories === undefined means "don't touch categories"
    // categories === [] means "remove all categories"
    // categories === [1,2,3] means "set these categories"
    if (categories !== undefined && Array.isArray(categories)) {
      // Delete existing categories
      const { error: deleteError } = await supabase
        .from("product_categories")
        .delete()
        .eq("product_id", id);

      if (deleteError) throw deleteError;

      // Add new categories (only if array is not empty)
      if (categories.length > 0) {
        const categoryInserts = categories.map((categoryId: number) => ({
          product_id: id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from("product_categories")
          .insert(categoryInserts);

        if (categoryError) throw categoryError;
      }
    }

    return data;
  },

  // Delete a product
  delete: async (id: number) => {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  },
};

// Category service
export const categoryService = {
  // Get all categories
  getAll: async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");

      if (error) {
        console.error("Supabase categories error:", error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("CategoryService getAll error:", error);
      throw error;
    }
  },

  // Get category by ID
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new category
  create: async (categoryData: any) => {
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a category
  update: async (id: number, categoryData: any) => {
    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a category
  delete: async (id: number) => {
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  },
};

// Order service
export const orderService = {
  // Get all orders
  getAll: async () => {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) throw error;
    return data;
  },

  // Get order by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new order
  create: async (orderData: any) => {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an order
  update: async (id: string, orderData: any) => {
    const { data, error } = await supabase
      .from("orders")
      .update(orderData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an order
  delete: async (id: string) => {
    const { data, error } = await supabase.from("orders").delete().eq("id", id);

    if (error) throw error;
    return data;
  },
};

// Customer service
export const customerService = {
  // Get all customers
  getAll: async () => {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) throw error;
    return data;
  },

  // Get customer by ID
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new customer
  create: async (customerData: any) => {
    const { data, error } = await supabase
      .from("customers")
      .insert([customerData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a customer
  update: async (id: number, customerData: any) => {
    const { data, error } = await supabase
      .from("customers")
      .update(customerData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a customer
  delete: async (id: number) => {
    const { data, error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  },
};
