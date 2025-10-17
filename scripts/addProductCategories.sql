-- Product Categories Junction Table
-- Bu script, ürünlerin birden fazla kategoriye ait olabilmesi için junction table oluşturur

-- 1. Product Categories Junction Table oluştur
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id) -- Aynı ürün-kategori kombinasyonu sadece bir kez olabilir
);

-- 2. Mevcut verileri migrate et
-- Önce mevcut category_id'leri product_categories tablosuna kopyala
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id 
FROM products 
WHERE category_id IS NOT NULL;

-- 3. Products tablosundan category_id sütununu kaldır (opsiyonel - geri dönüş için saklayabiliriz)
-- ALTER TABLE products DROP COLUMN category_id;

-- 4. Index'ler oluştur
CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

-- 5. RLS politikaları
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Herkes kategorileri görebilir
CREATE POLICY "Anyone can view product categories" ON product_categories
  FOR SELECT USING (true);

-- Sadece admin'ler ürün-kategori ilişkilerini yönetebilir
CREATE POLICY "Admins can manage product categories" ON product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 6. View oluştur - ürünlerin kategorilerini kolayca getirmek için
CREATE OR REPLACE VIEW products_with_categories AS
SELECT 
  p.*,
  COALESCE(
    ARRAY_AGG(
      JSON_BUILD_OBJECT(
        'id', c.id,
        'name', c.name,
        'description', c.description,
        'is_active', c.is_active
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    ARRAY[]::JSON[]
  ) as categories
FROM products p
LEFT JOIN product_categories pc ON p.id = pc.product_id
LEFT JOIN categories c ON pc.category_id = c.id
GROUP BY p.id;

-- 7. Function oluştur - ürünün kategorilerini güncellemek için
CREATE OR REPLACE FUNCTION update_product_categories(
  p_product_id INTEGER,
  p_category_ids INTEGER[]
)
RETURNS VOID AS $$
BEGIN
  -- Mevcut kategorileri sil
  DELETE FROM product_categories WHERE product_id = p_product_id;
  
  -- Yeni kategorileri ekle
  IF p_category_ids IS NOT NULL AND array_length(p_category_ids, 1) > 0 THEN
    INSERT INTO product_categories (product_id, category_id)
    SELECT p_product_id, unnest(p_category_ids);
  END IF;
END;
$$ LANGUAGE plpgsql;
