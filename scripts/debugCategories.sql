-- Debug script - mevcut durumu kontrol et

-- 1. Products tablosundaki category_id'leri kontrol et
SELECT id, name, category_id 
FROM products 
WHERE id = 16;

-- 2. Categories tablosunu kontrol et
SELECT id, name 
FROM categories 
ORDER BY id;

-- 3. Product_categories tablosunu kontrol et
SELECT * FROM product_categories 
WHERE product_id = 16;

-- 4. Tüm product_categories verilerini kontrol et
SELECT pc.*, p.name as product_name, c.name as category_name
FROM product_categories pc
LEFT JOIN products p ON pc.product_id = p.id
LEFT JOIN categories c ON pc.category_id = c.id
ORDER BY pc.product_id;
