-- ============================================
-- EKSIK TABLOLARI OLUŞTURMA SCRIPT'İ
-- ============================================
-- Bu script eksik olan kritik tabloları oluşturur
-- Sırayla çalıştırılmalıdır

-- ============================================
-- 1. PRODUCT_CATEGORIES TABLOSU
-- ============================================
-- Çoklu kategori desteği için ara tablo

CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_lookup ON product_categories(product_id, category_id);

COMMENT ON TABLE product_categories IS 'Ürün ve kategori ilişkileri için ara tablo';
COMMENT ON COLUMN product_categories.product_id IS 'Ürün ID referansı';
COMMENT ON COLUMN product_categories.category_id IS 'Kategori ID referansı';

-- ============================================
-- 2. PRICE_TIERS TABLOSU
-- ============================================
-- Toplu satış fiyat kademeleri

CREATE TABLE IF NOT EXISTS price_tiers (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL CHECK (min_quantity > 0),
  max_quantity INTEGER CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  discount_percentage DECIMAL(5, 2) CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_price_tiers_product ON price_tiers(product_id);
CREATE INDEX IF NOT EXISTS idx_price_tiers_quantity ON price_tiers(product_id, min_quantity);

COMMENT ON TABLE price_tiers IS 'Ürünler için toplu satış fiyat kademeleri';
COMMENT ON COLUMN price_tiers.min_quantity IS 'Minimum adet (dahil)';
COMMENT ON COLUMN price_tiers.max_quantity IS 'Maksimum adet (dahil), NULL = sınırsız';
COMMENT ON COLUMN price_tiers.price IS 'Bu kademe için birim fiyat';
COMMENT ON COLUMN price_tiers.discount_percentage IS 'İndirim yüzdesi (opsiyonel)';

-- ============================================
-- 3. PRODUCT_MEDIA TABLOSU
-- ============================================
-- Ürün medya dosyaları için detaylı yönetim

CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT CHECK (file_size > 0),
  mime_type TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_primary ON product_media(product_id, is_primary) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS idx_product_media_sort ON product_media(product_id, sort_order);

COMMENT ON TABLE product_media IS 'Ürün resim ve video dosyaları';
COMMENT ON COLUMN product_media.file_path IS 'Storage bucket içindeki dosya yolu';
COMMENT ON COLUMN product_media.is_primary IS 'Ana ürün görseli mi?';
COMMENT ON COLUMN product_media.sort_order IS 'Görüntüleme sırası (küçükten büyüğe)';

-- ============================================
-- 4. MEVCUT PRODUCTS TABLOSUNA YENİ ALANLAR EKLE
-- ============================================

-- has_price_tiers alanı (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'has_price_tiers'
  ) THEN
    ALTER TABLE products ADD COLUMN has_price_tiers BOOLEAN DEFAULT false;
    COMMENT ON COLUMN products.has_price_tiers IS 'Ürünün fiyat kademesi var mı?';
  END IF;
END $$;

-- applied_price alanı cart_items tablosuna (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'applied_price'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN applied_price DECIMAL(10, 2);
    COMMENT ON COLUMN cart_items.applied_price IS 'Uygulanmış kademe fiyatı';
  END IF;
END $$;

-- ============================================
-- 5. STORAGE BUCKET OLUŞTUR
-- ============================================

-- product-media bucket'ı oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-media',
  'product-media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- BAŞARILI MESAJI
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Tüm eksik tablolar başarıyla oluşturuldu!';
  RAISE NOTICE '📋 Oluşturulan tablolar:';
  RAISE NOTICE '   - product_categories';
  RAISE NOTICE '   - price_tiers';
  RAISE NOTICE '   - product_media';
  RAISE NOTICE '';
  RAISE NOTICE '📦 Storage bucket oluşturuldu: product-media';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Sonraki adım: 02_create_rls_policies.sql çalıştırın';
END $$;
