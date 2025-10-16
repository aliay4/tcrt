import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // For now, we're handling admin access control on the client side
  // because RLS policies make it difficult to check user roles in middleware
  // The admin layout will handle the actual access control
  
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
