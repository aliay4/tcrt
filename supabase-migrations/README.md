# 🗄️ Supabase Database Migrations

Bu klasör, e-ticaret platformunuzun Supabase veritabanı migration script'lerini içerir.

## 📋 İçindekiler

1. `01_create_missing_tables.sql` - Eksik tabloları oluşturur
2. `02_create_rls_policies.sql` - Güvenlik politikalarını ayarlar
3. `DATABASE_SCHEMA_IMPROVEMENTS.md` - Detaylı iyileştirme dökümanı

## 🚀 Kurulum Adımları

### 1. Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü açın

### 2. Migration Script'lerini Çalıştırma

#### Adım 1: Eksik Tabloları Oluştur
```sql
-- 01_create_missing_tables.sql dosyasının içeriğini kopyalayıp çalıştırın
```

Bu script şunları oluşturur:
- ✅ `product_categories` tablosu (çoklu kategori desteği)
- ✅ `price_tiers` tablosu (toplu satış fiyatları)
- ✅ `product_media` tablosu (medya dosya yönetimi)
- ✅ `product-media` storage bucket'ı
- ✅ Gerekli index'ler

**Beklenen Sonuç:**
```
✅ Tüm eksik tablolar başarıyla oluşturuldu!
```

#### Adım 2: RLS Politikalarını Oluştur
```sql
-- 02_create_rls_policies.sql dosyasının içeriğini kopyalayıp çalıştırın
```

Bu script şunları oluşturur:
- 🔐 Row Level Security politikaları
- 🔑 `is_admin()` helper fonksiyonu
- 🛡️ Kullanıcı, admin ve misafir için erişim kontrolleri
- 📦 Storage bucket güvenlik politikaları

**Beklenen Sonuç:**
```
✅ Tüm RLS politikaları başarıyla oluşturuldu!
```

## ⚠️ ÖNEMLİ NOTLAR

### Öncelik Sırası

**🔴 KRİTİK (Hemen Yapılmalı):**
1. ✅ Eksik tabloları oluştur (`01_create_missing_tables.sql`)
2. ✅ RLS politikalarını ekle (`02_create_rls_policies.sql`)

**🟡 ÖNEMLİ (Kısa Vadede):**
3. Admin kullanıcı oluştur (aşağıda detay var)
4. Storage limitleri ayarla

**🟢 İYİLEŞTİRME (Uzun Vadede):**
5. Backup stratejisi oluştur
6. Analytics tabloları ekle

### Migration Kontrolü

Her script çalıştırıldıktan sonra kontrol edin:

```sql
-- Tabloların oluşturulduğunu kontrol et
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('product_categories', 'price_tiers', 'product_media');

-- RLS'nin aktif olduğunu kontrol et
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Storage bucket'ın oluşturulduğunu kontrol et
SELECT * FROM storage.buckets WHERE id = 'product-media';
```

## 👤 Admin Kullanıcı Oluşturma

Migration'lardan sonra admin kullanıcı oluşturun:

### Yöntem 1: SQL ile
```sql
-- Önce auth.users'da bir kullanıcı oluşturun (Supabase Auth üzerinden)
-- Sonra role'ünü admin yapın:

UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### Yöntem 2: Supabase Dashboard ile
1. **Authentication** > **Users** bölümüne gidin
2. Kullanıcıyı seçin
3. **SQL Editor**'de yukarıdaki UPDATE komutunu çalıştırın

## 🔍 Sorun Giderme

### Hata: "relation does not exist"
**Çözüm:** Script'leri sırayla çalıştırdığınızdan emin olun.

### Hata: "permission denied"
**Çözüm:** Supabase projenizde yeterli yetkiye sahip olduğunuzdan emin olun.

### Hata: "policy already exists"
**Çözüm:** Script içinde `DROP POLICY IF EXISTS` kullanılıyor, script'i tekrar çalıştırabilirsiniz.

### RLS Politikaları Çalışmıyor
```sql
-- RLS'nin aktif olduğunu kontrol edin
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
```

## 📊 Güvenlik Kontrolleri

Migration sonrası bu kontrolleri yapın:

```sql
-- 1. Admin fonksiyonunun çalıştığını test et
SELECT is_admin();  -- Admin kullanıcı için true dönmeli

-- 2. RLS politikalarının sayısını kontrol et
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename;

-- 3. Storage politikalarını kontrol et
SELECT * FROM storage.policies WHERE bucket_id = 'product-media';
```

## 🎯 Başarı Kriterleri

Migration başarılı sayılır eğer:

- ✅ 3 yeni tablo oluşturuldu
- ✅ Tüm tablolarda RLS aktif
- ✅ `is_admin()` fonksiyonu çalışıyor
- ✅ Storage bucket oluşturuldu ve erişilebilir
- ✅ En az 1 admin kullanıcı var
- ✅ Frontend'de kategori ve fiyat kademe özellikleri çalışıyor

## 📝 Rollback (Geri Alma)

Eğer bir şeyler ters giderse:

```sql
-- Tabloları sil (DİKKATLİ: Tüm veriyi siler!)
DROP TABLE IF EXISTS product_media CASCADE;
DROP TABLE IF EXISTS price_tiers CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;

-- Storage bucket'ı sil
DELETE FROM storage.buckets WHERE id = 'product-media';

-- Helper fonksiyonları sil
DROP FUNCTION IF EXISTS is_admin();
```

## 🔗 İlgili Dökümanlar

- `DATABASE_SCHEMA_IMPROVEMENTS.md` - Detaylı teknik döküman
- `../DATABASE_SCHEMA.md` - Orijinal veritabanı şeması
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)

## 💡 İpuçları

1. **Backup Alın:** Migration öncesi veritabanı backup'ı alın
2. **Test Edin:** Önce development/staging ortamında test edin
3. **Log Tutun:** Migration sırasında çıkan mesajları kaydedin
4. **Doğrulayın:** Her adımdan sonra kontrol scriptlerini çalıştırın

## 📞 Destek

Sorun yaşarsanız:
1. `DATABASE_SCHEMA_IMPROVEMENTS.md` dosyasını kontrol edin
2. Supabase Dashboard > **Database** > **Logs** bölümünü inceleyin
3. Console hatalarını kontrol edin

---

**Son Güncelleme:** 2024  
**Durum:** 🟢 Ready for Production  
**Versiyon:** 1.0.0