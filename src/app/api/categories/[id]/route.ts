import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/categories/[id] - Get a single category by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz kategori ID' },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        products:products(count)
      `)
      .eq('id', categoryId)
      .single();

    if (error || !category) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        product_count: category.products?.[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Error in GET /api/categories/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz kategori ID' },
        { status: 400 }
      );
    }

    // Kategori var mı kontrol et
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Aynı isimde başka kategori var mı kontrol et (eğer isim değiştiriliyorsa)
    if (body.name) {
      const { data: duplicateCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', body.name)
        .neq('id', categoryId)
        .single();

      if (duplicateCategory) {
        return NextResponse.json(
          { success: false, error: 'Bu isimde bir kategori zaten mevcut' },
          { status: 400 }
        );
      }
    }
    
    // Kategoriyi güncelle
    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update({
        name: body.name,
        description: body.description,
        image_url: body.image_url,
        is_active: body.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        { success: false, error: 'Kategori güncellenemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error in PUT /api/categories/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz kategori ID' },
        { status: 400 }
      );
    }

    // Kategori var mı kontrol et
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Kategoride ürün var mı kontrol et
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (products && products.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Bu kategoride ürünler bulunuyor. Önce ürünleri başka kategoriye taşıyın.' },
        { status: 400 }
      );
    }
    
    // Kategoriyi sil
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        { success: false, error: 'Kategori silinemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla silindi'
    });
  } catch (error) {
    console.error('Error in DELETE /api/categories/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}