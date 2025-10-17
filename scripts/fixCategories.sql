-- Fix Categories Script
-- Bu script, mevcut verileri düzeltir ve eksik migration'ları tamamlar

-- 1. Önce mevcut product_categories verilerini temizle (eğer varsa)
DELETE FROM product_categories;

-- 2. Products tablosundaki tüm category_id'leri product_categories'e migrate et
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id 
FROM products 
WHERE category_id IS NOT NULL;

-- 3. Sonucu kontrol et
SELECT 
  p.id as product_id,
  p.name as product_name,
  p.category_id as old_category_id,
  pc.category_id as new_category_id,
  c.name as category_name
FROM products p
LEFT JOIN product_categories pc ON p.id = pc.product_id
LEFT JOIN categories c ON pc.category_id = c.id
WHERE p.id = 16;

-- 4. Tüm product_categories verilerini listele
SELECT 
  pc.*,
  p.name as product_name,
  c.name as category_name
FROM product_categories pc
LEFT JOIN products p ON pc.product_id = p.id
LEFT JOIN categories c ON pc.category_id = c.id
ORDER BY pc.product_id;
