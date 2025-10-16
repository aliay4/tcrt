import { NextResponse } from 'next/server';

// Sample product data - in a real app, this would come from a database
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 129.99,
    category: "Electronics",
    stock: 45,
    image: "/placeholder-product.jpg",
    rating: 4.5,
    brand: "SoundMax"
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    description: "Advanced smartwatch with health monitoring features",
    price: 199.99,
    category: "Electronics",
    stock: 32,
    image: "/placeholder-product.jpg",
    rating: 4.8,
    brand: "TechWear"
  },
  {
    id: 3,
    name: "Designer Sunglasses",
    description: "Stylish sunglasses with UV protection",
    price: 89.99,
    category: "Accessories",
    stock: 12,
    image: "/placeholder-product.jpg",
    rating: 4.3,
    brand: "SunStyle"
  },
  {
    id: 4,
    name: "Leather Wallet",
    description: "Genuine leather wallet with multiple card slots",
    price: 49.99,
    category: "Accessories",
    stock: 0,
    image: "/placeholder-product.jpg",
    rating: 4.6,
    brand: "LeatherCraft"
  },
];

// GET /api/products/[id] - Get a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = parseInt(params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: product
  });
}

// PUT /api/products/[id] - Update a product (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = parseInt(params.id);
  const body = await request.json();
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }
  
  // Update the product
  products[productIndex] = { ...products[productIndex], ...body, id: productId };
  
  return NextResponse.json({
    success: true,
    data: products[productIndex]
  });
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = parseInt(params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }
  
  // Remove the product
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  return NextResponse.json({
    success: true,
    data: deletedProduct,
    message: 'Product deleted successfully'
  });
}