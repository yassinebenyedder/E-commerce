import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the auth token from cookies
    const authToken = request.cookies.get('admin-token');
    
    // If no token exists, redirect to admin login
    if (!authToken) {
      // Allow access to the admin login page itself
      if (request.nextUrl.pathname === '/admin') {
        return NextResponse.next();
      }
      
      // Redirect other admin routes to login
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Additional security headers for admin pages
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
