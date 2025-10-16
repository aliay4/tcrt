#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script helps initialize the Supabase database with the required tables
 * and initial data for the e-commerce platform.
 * 
 * Usage:
 *   npx ts-node scripts/setupDatabase.ts
 */

import { createClient } from '@supabase/supabase-js';

// Sample initial data
const initialCategories = [
  { name: 'Electronics', description: 'Electronic devices and accessories' },
  { name: 'Clothing', description: 'Apparel and fashion items' },
  { name: 'Home & Kitchen', description: 'Home appliances and kitchenware' },
  { name: 'Books', description: 'Books and educational materials' },
  { name: 'Sports', description: 'Sports equipment and accessories' },
];

const initialProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 129.99,
    compare_price: 199.99,
    category_id: 1,
    sku: 'WBH-001',
    quantity: 45,
    is_active: true
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring features',
    price: 199.99,
    compare_price: 299.99,
    category_id: 1,
    sku: 'SW-005',
    quantity: 32,
    is_active: true
  },
  {
    name: 'Designer Sunglasses',
    description: 'Stylish sunglasses with UV protection',
    price: 89.99,
    compare_price: 129.99,
    category_id: 3,
    sku: 'DS-001',
    quantity: 12,
    is_active: true
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots',
    price: 49.99,
    compare_price: 69.99,
    category_id: 2,
    sku: 'LW-001',
    quantity: 0,
    is_active: true
  },
];

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Get Supabase configuration from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL and key must be set in environment variables');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Create categories
    console.log('Creating categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert(initialCategories)
      .select();
    
    if (categoriesError) {
      console.error('Error creating categories:', categoriesError);
    } else {
      console.log(`Created ${categories?.length || 0} categories`);
    }
    
    // Create products
    console.log('Creating products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(initialProducts)
      .select();
    
    if (productsError) {
      console.error('Error creating products:', productsError);
    } else {
      console.log(`Created ${products?.length || 0} products`);
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error during database setup:', error);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;