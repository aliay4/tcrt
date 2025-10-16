import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/categories - Tüm kategorileri getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = supabase
      .from('categories')
      .select(`
        *,
        products:products(count)
      `)
      .order('created_at', { ascending: false });

    // Duruma göre filtrele
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { success: false, error: 'Kategoriler yüklenemedi' },
        { status: 500 }
      );
    }

    // Ürün sayısını hesapla
    const categoriesWithCount = categories?.map(category => ({
      ...category,
      product_count: category.products?.[0]?.count || 0
    })) || [];

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
      count: categoriesWithCount.length
    });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Yeni kategori oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Gerekli alanları doğrula
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Kategori adı gerekli' },
        { status: 400 }
      );
    }
    
    // Kategori zaten var mı kontrol et
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', body.name)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Bu isimde bir kategori zaten mevcut' },
        { status: 400 }
      );
    }
    
    // Yeni kategori oluştur
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        name: body.name,
        description: body.description || null,
        image_url: body.image_url || null,
        is_active: body.is_active !== undefined ? body.is_active : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { success: false, error: 'Kategori oluşturulamadı' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newCategory
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}