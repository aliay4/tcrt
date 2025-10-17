-- Update products table to add missing columns
-- This script should be run on your Supabase database

-- Add stock_quantity column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
        ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'image_url') THEN
        ALTER TABLE products ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Add media_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'media_url') THEN
        ALTER TABLE products ADD COLUMN media_url TEXT;
    END IF;
END $$;

-- Add product_image column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'product_image') THEN
        ALTER TABLE products ADD COLUMN product_image TEXT;
    END IF;
END $$;

-- Copy quantity values to stock_quantity for existing products
UPDATE products 
SET stock_quantity = quantity 
WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- Copy images array first element to image_url if image_url is empty
UPDATE products 
SET image_url = images[1] 
WHERE (image_url IS NULL OR image_url = '') 
  AND images IS NOT NULL 
  AND array_length(images, 1) > 0;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url);
