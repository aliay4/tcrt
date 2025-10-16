import { NextResponse } from 'next/server';

// Örnek ürün verileri - gerçek uygulamada bu veriler veritabanından gelecek
const products = [
  {
    id: 1,
    name: "Kablosuz Bluetooth Kulaklık",
    description: "Gürültü önleyici özellikli yüksek kaliteli kablosuz kulaklık",
    price: 129.99,
    category: "Elektronik",
    stock: 45,
    image: "/placeholder-product.jpg",
    rating: 4.5,
    brand: "SesMaks"
  },
  {
    id: 2,
    name: "Akıllı Saat Seri 5",
    description: "Sağlık takip özellikli gelişmiş akıllı saat",
    price: 199.99,
    category: "Elektronik",
    stock: 32,
    image: "/placeholder-product.jpg",
    rating: 4.8,
    brand: "TeknolojiGiyim"
  },
  {
    id: 3,
    name: "Tasarımcı Güneş Gözlüğü",
    description: "UV korumalı şık güneş gözlüğü",
    price: 89.99,
    category: "Aksesuar",
    stock: 12,
    image: "/placeholder-product.jpg",
    rating: 4.3,
    brand: "GüneşStil"
  },
  {
    id: 4,
    name: "Deri Cüzdan",
    description: "Çoklu kart yuvası olan gerçek deri cüzdan",
    price: 49.99,
    category: "Aksesuar",
    stock: 0,
    image: "/placeholder-product.jpg",
    rating: 4.6,
    brand: "DeriZanaat"
  },
];

// GET /api/products - Tüm ürünleri getir
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  let filteredProducts = [...products];
  
  // Kategoriye göre filtrele (sağlanırsa)
  if (category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Arama terimine göre filtrele (sağlanırsa)
  if (search) {
    filteredProducts = filteredProducts.filter(
      product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return NextResponse.json({
    success: true,
    data: filteredProducts,
    count: filteredProducts.length
  });
}

// POST /api/products - Yeni ürün oluştur (sadece admin)
export async function POST(request: Request) {
  const body = await request.json();
  
  // Gerekli alanları doğrula
  if (!body.name || !body.price || !body.category) {
    return NextResponse.json(
      { success: false, error: 'Ad, fiyat ve kategori gerekli' },
      { status: 400 }
    );
  }
  
  // Gerçek uygulamada veritabanına kaydedilecek
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    ...body
  };
  
  // Bellek dizimize ekle (gerçek uygulamada veritabanına kaydet)
  products.push(newProduct);
  
  return NextResponse.json({
    success: true,
    data: newProduct
  }, { status: 201 });
}