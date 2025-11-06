# 🔍 SUPABASE VERİTABANI İYİLEŞTİRMELERİ VE EKSİKLİKLER

## ❌ EKSIK TABLOLAR

### 1. `product_categories` Tablosu
**Durum:** ❌ Eksik  
**Açıklama:** Çoklu kategori desteği için gerekli ara tablo

```sql
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Index'ler
CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

-- RLS Politikaları
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product categories" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product categories" ON product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### 2. `price_tiers` Tablosu
**Durum:** ❌ Eksik  
**Açıklama:** Toplu satış fiyat kademeleri için

```sql
CREATE TABLE price_tiers (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  discount_percentage DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_quantity_range CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  CONSTRAINT positive_price CHECK (price > 0)
);

-- Index'ler
CREATE INDEX idx_price_tiers_product ON price_tiers(product_id);

-- RLS Politikaları
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view price tiers" ON price_tiers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage price tiers" ON price_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### 3. `product_media` Tablosu
**Durum:** ❌ Eksik  
**Açıklama:** Ürün medya dosyaları için detaylı yönetim

```sql
CREATE TABLE product_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_product_media_product ON product_media(product_id);
CREATE INDEX idx_product_media_primary ON product_media(is_primary) WHERE is_primary = true;

-- RLS Politikaları
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product media" ON product_media
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product media" ON product_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## ⚠️ EKSİK RLS POLİTİKALARI

### Products Tablosu
```sql
-- Herkes aktif ürünleri görebilir
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Adminler tüm ürünleri görebilir
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Adminler ürün ekleyebilir
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Adminler ürün güncelleyebilir
CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Adminler ürün silebilir
CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### Categories Tablosu
```sql
-- Herkes aktif kategorileri görebilir
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Adminler tüm kategorileri yönetebilir
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### Cart Items Tablosu
```sql
-- Kullanıcılar sadece kendi sepetlerini görebilir
CREATE POLICY "Users can view their own cart" ON cart_items
  FOR SELECT USING (user_id = auth.uid());

-- Kullanıcılar kendi sepetlerine ekleme yapabilir
CREATE POLICY "Users can add to their cart" ON cart_items
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Kullanıcılar kendi sepetlerini güncelleyebilir
CREATE POLICY "Users can update their cart" ON cart_items
  FOR UPDATE USING (user_id = auth.uid());

-- Kullanıcılar kendi sepetlerinden silebilir
CREATE POLICY "Users can delete from their cart" ON cart_items
  FOR DELETE USING (user_id = auth.uid());
```

---

### Favorites Tablosu
```sql
-- Kullanıcılar sadece kendi favorilerini görebilir
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (user_id = auth.uid());

-- Kullanıcılar favorilerine ekleyebilir
CREATE POLICY "Users can add to favorites" ON favorites
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Kullanıcılar favorilerinden silebilir
CREATE POLICY "Users can delete from favorites" ON favorites
  FOR DELETE USING (user_id = auth.uid());
```

---

### Orders Tablosu
```sql
-- Kullanıcılar sadece kendi siparişlerini görebilir
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- Adminler tüm siparişleri görebilir
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Kullanıcılar sipariş oluşturabilir
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Adminler siparişleri güncelleyebilir
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 🔧 EKSİK TRIGGER'LAR

### 1. Updated_at Otomatik Güncelleme
```sql
-- Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'lar
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_tiers_updated_at BEFORE UPDATE ON price_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_media_updated_at BEFORE UPDATE ON product_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. Yeni Kullanıcı Otomatik Kayıt
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

### 3. Stok Kontrolü
```sql
CREATE OR REPLACE FUNCTION check_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT stock_quantity FROM products WHERE id = NEW.product_id) < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_cart_stock BEFORE INSERT OR UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION check_product_stock();
```

---

### 4. Sipariş Sonrası Stok Güncelleme
```sql
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_order AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_stock_after_order();
```

---

## 🗄️ STORAGE BUCKET DÜZELTMELERİ

### Mevcut Bucket Adı Hatası
**Sorun:** Kod'da `product-media` kullanılıyor ama schema'da `product-images`

```sql
-- Doğru bucket oluştur
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Politikaları
CREATE POLICY "Anyone can view product media" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-media');

CREATE POLICY "Authenticated users can upload product media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-media' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can delete product media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-media' AND
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update product media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-media' AND
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 🚀 PERFORMANS İYİLEŞTİRMELERİ

### Eksik Index'ler
```sql
-- Products
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Orders
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status_user ON orders(status, user_id);

-- Cart Items
CREATE INDEX idx_cart_items_user_product ON cart_items(user_id, product_id);

-- Product Media
CREATE INDEX idx_product_media_product_order ON product_media(product_id, sort_order);
```

---

### Full Text Search
```sql
-- Ürün arama için
ALTER TABLE products ADD COLUMN search_vector tsvector;

CREATE INDEX idx_products_search ON products USING GIN(search_vector);

CREATE OR REPLACE FUNCTION products_search_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('turkish', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('turkish', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_update BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_trigger();
```

---

## 🔐 GÜVENLİK İYİLEŞTİRMELERİ

### 1. Admin Kontrolü için Helper Function
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 2. Rate Limiting (Optional - Application Level)
Frontend'de implement edilmeli:
- API çağrılarını throttle edin
- Debounce search işlemleri
- Cache mekanizması ekleyin

---

### 3. SQL Injection Koruması
✅ Supabase client otomatik olarak parametrize ediyor
✅ RLS politikaları aktif

---

## 📊 ANALİTİK VE RAPORLAMA

### Eksik Tablolar (Opsiyonel)
```sql
-- Admin için analytics
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
```

---

## ✅ ÖNCE­LİK SIRASI

### 🔴 Kritik (Hemen Yapılmalı)
1. ✅ `product_categories` tablosu oluştur
2. ✅ `price_tiers` tablosu oluştur
3. ✅ `product_media` tablosu oluştur
4. ⚠️ Storage bucket düzelt (`product-media`)
5. ⚠️ RLS politikalarını ekle (tüm tablolar için)
6. ⚠️ `handle_new_user` trigger'ı ekle

### 🟡 Önemli (Kısa Vadede)
7. ⚠️ `updated_at` trigger'larını ekle
8. ⚠️ Eksik index'leri oluştur
9. ⚠️ `is_admin()` helper function ekle

### 🟢 İyileştirme (Uzun Vadede)
10. Full text search ekle
11. Stok kontrolü trigger'ı ekle
12. Analytics tablosu ekle
13. Backup stratejisi oluştur

---

## 🛠️ HIZLI KURULUM SCRIPT'İ

Tüm kritik değişiklikleri yapmak için:

```sql
-- 1. Tabloları oluştur
\i create_tables.sql

-- 2. RLS politikalarını ekle
\i create_rls_policies.sql

-- 3. Trigger'ları ekle
\i create_triggers.sql

-- 4. Index'leri oluştur
\i create_indexes.sql
```

---

## 📝 NOTLAR

- ✅ Frontend'de kategori ve fiyat kademe özellikleri çalışıyor
- ⚠️ Backend (Supabase) tablolarında eksiklik var
- 🔴 Şu anda kod Supabase API üzerinden manuel olarak yönetiliyor
- ⚠️ RLS politikaları olmadığı için güvenlik riski var
- 🔐 Storage bucket isimlendirme tutarsızlığı var

---

## 🎯 SONRAKİ ADIMLAR

1. Supabase Dashboard'a gir
2. SQL Editor'ü aç
3. Bu dokümandaki SQL komutlarını sırayla çalıştır
4. Frontend testlerini yap
5. RLS politikalarını test et
6. Production'a deploy et

---

**Son Güncelleme:** 2024
**Durum:** 🟡 Kısmi Implementasyon
**Risk Seviyesi:** 🔴 Yüksek (RLS eksikliği nedeniyle)