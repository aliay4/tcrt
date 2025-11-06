-- ============================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ============================================
-- Bu script tüm tablolar için güvenlik politikalarını oluşturur
-- Önce 01_create_missing_tables.sql çalıştırılmalıdır

-- ============================================
-- RLS'Yİ AKTİF ET
-- ============================================

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Admin kontrolü için helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_admin() IS 'Mevcut kullanıcının admin olup olmadığını kontrol eder';

-- ============================================
-- PRODUCTS TABLOSU POLİTİKALARI
-- ============================================

-- Herkes aktif ürünleri görebilir
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Adminler tüm ürünleri görebilir
DROP POLICY IF EXISTS "Admins can view all products" ON products;
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (is_admin());

-- Adminler ürün ekleyebilir
DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (is_admin());

-- Adminler ürün güncelleyebilir
DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (is_admin());

-- Adminler ürün silebilir
DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (is_admin());

-- ============================================
-- CATEGORIES TABLOSU POLİTİKALARI
-- ============================================

-- Herkes aktif kategorileri görebilir
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Adminler tüm kategorileri görebilir
DROP POLICY IF EXISTS "Admins can view all categories" ON categories;
CREATE POLICY "Admins can view all categories" ON categories
  FOR SELECT USING (is_admin());

-- Adminler kategori ekleyebilir
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories" ON categories
  FOR INSERT WITH CHECK (is_admin());

-- Adminler kategori güncelleyebilir
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
CREATE POLICY "Admins can update categories" ON categories
  FOR UPDATE USING (is_admin());

-- Adminler kategori silebilir
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories" ON categories
  FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCT_CATEGORIES TABLOSU POLİTİKALARI
-- ============================================

-- Herkes ürün-kategori ilişkilerini görebilir
DROP POLICY IF EXISTS "Anyone can view product categories" ON product_categories;
CREATE POLICY "Anyone can view product categories" ON product_categories
  FOR SELECT USING (true);

-- Adminler yönetebilir
DROP POLICY IF EXISTS "Admins can manage product categories" ON product_categories;
CREATE POLICY "Admins can manage product categories" ON product_categories
  FOR ALL USING (is_admin());

-- ============================================
-- PRICE_TIERS TABLOSU POLİTİKALARI
-- ============================================

-- Herkes fiyat kademelerini görebilir
DROP POLICY IF EXISTS "Anyone can view price tiers" ON price_tiers;
CREATE POLICY "Anyone can view price tiers" ON price_tiers
  FOR SELECT USING (true);

-- Adminler yönetebilir
DROP POLICY IF EXISTS "Admins can manage price tiers" ON price_tiers;
CREATE POLICY "Admins can manage price tiers" ON price_tiers
  FOR ALL USING (is_admin());

-- ============================================
-- PRODUCT_MEDIA TABLOSU POLİTİKALARI
-- ============================================

-- Herkes ürün medyasını görebilir
DROP POLICY IF EXISTS "Anyone can view product media" ON product_media;
CREATE POLICY "Anyone can view product media" ON product_media
  FOR SELECT USING (true);

-- Adminler yönetebilir
DROP POLICY IF EXISTS "Admins can manage product media" ON product_media;
CREATE POLICY "Admins can manage product media" ON product_media
  FOR ALL USING (is_admin());

-- ============================================
-- CART_ITEMS TABLOSU POLİTİKALARI
-- ============================================

-- Kullanıcılar sadece kendi sepetlerini görebilir
DROP POLICY IF EXISTS "Users can view their own cart" ON cart_items;
CREATE POLICY "Users can view their own cart" ON cart_items
  FOR SELECT USING (user_id = auth.uid());

-- Kullanıcılar kendi sepetlerine ekleme yapabilir
DROP POLICY IF EXISTS "Users can add to their cart" ON cart_items;
CREATE POLICY "Users can add to their cart" ON cart_items
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Kullanıcılar kendi sepetlerini güncelleyebilir
DROP POLICY IF EXISTS "Users can update their cart" ON cart_items;
CREATE POLICY "Users can update their cart" ON cart_items
  FOR UPDATE USING (user_id = auth.uid());

-- Kullanıcılar kendi sepetlerinden silebilir
DROP POLICY IF EXISTS "Users can delete from their cart" ON cart_items;
CREATE POLICY "Users can delete from their cart" ON cart_items
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- FAVORITES TABLOSU POLİTİKALARI
-- ============================================

-- Kullanıcılar sadece kendi favorilerini görebilir
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (user_id = auth.uid());

-- Kullanıcılar favorilerine ekleyebilir
DROP POLICY IF EXISTS "Users can add to favorites" ON favorites;
CREATE POLICY "Users can add to favorites" ON favorites
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Kullanıcılar favorilerinden silebilir
DROP POLICY IF EXISTS "Users can delete from favorites" ON favorites;
CREATE POLICY "Users can delete from favorites" ON favorites
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- ORDERS TABLOSU POLİTİKALARI
-- ============================================

-- Kullanıcılar sadece kendi siparişlerini görebilir
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- Adminler tüm siparişleri görebilir
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

-- Kullanıcılar sipariş oluşturabilir
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Adminler siparişleri güncelleyebilir
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (is_admin());

-- ============================================
-- ORDER_ITEMS TABLOSU POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi sipariş kalemlerini görebilir
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Adminler tüm sipariş kalemlerini görebilir
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

-- Kullanıcılar sipariş kalemlerini ekleyebilir (sipariş oluşturma sırasında)
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
CREATE POLICY "Users can insert order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- USERS TABLOSU POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi bilgilerini görebilir
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (id = auth.uid());

-- Kullanıcılar kendi bilgilerini güncelleyebilir
DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- Adminler tüm kullanıcıları görebilir
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (is_admin());

-- Adminler kullanıcıları güncelleyebilir
DROP POLICY IF EXISTS "Admins can update users" ON users;
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (is_admin());

-- ============================================
-- STORAGE POLİTİKALARI (product-media bucket)
-- ============================================

-- Herkes product-media bucket'ındaki dosyaları görebilir
DROP POLICY IF EXISTS "Anyone can view product media" ON storage.objects;
CREATE POLICY "Anyone can view product media" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-media');

-- Kimlik doğrulaması yapanlar yükleyebilir
DROP POLICY IF EXISTS "Authenticated users can upload product media" ON storage.objects;
CREATE POLICY "Authenticated users can upload product media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-media' AND
    auth.role() = 'authenticated'
  );

-- Adminler silebilir
DROP POLICY IF EXISTS "Admins can delete product media" ON storage.objects;
CREATE POLICY "Admins can delete product media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-media' AND
    is_admin()
  );

-- Adminler güncelleyebilir
DROP POLICY IF EXISTS "Admins can update product media" ON storage.objects;
CREATE POLICY "Admins can update product media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-media' AND
    is_admin()
  );

-- ============================================
-- BAŞARILI MESAJI
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Tüm RLS politikaları başarıyla oluşturuldu!';
  RAISE NOTICE '🔐 Güvenlik Politikaları:';
  RAISE NOTICE '   - Products: Aktif olanlar herkese açık, admin full erişim';
  RAISE NOTICE '   - Categories: Aktif olanlar herkese açık, admin full erişim';
  RAISE NOTICE '   - Cart: Kullanıcılar sadece kendi sepetlerini yönetebilir';
  RAISE NOTICE '   - Favorites: Kullanıcılar sadece kendi favorilerini yönetebilir';
  RAISE NOTICE '   - Orders: Kullanıcılar sadece kendi siparişlerini görebilir';
  RAISE NOTICE '   - Price Tiers: Herkes görebilir, admin yönetebilir';
  RAISE NOTICE '   - Product Media: Herkes görebilir, admin yönetebilir';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Sonraki adım: 03_create_triggers.sql çalıştırın';
END $$;
