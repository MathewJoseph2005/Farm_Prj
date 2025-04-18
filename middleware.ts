import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /dashboard, /api/auth/me)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/login' || 
                      path === '/auth/register' || 
                      path === '/' ||
                      path.startsWith('/api/auth/login') || 
                      path.startsWith('/api/auth/register');

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // Only redirect login/register pages to dashboard if user is already logged in
  // Allow users to access the landing page (/) even when logged in
  if ((path === '/auth/login' || path === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the path is protected and user is not logged in,
  // redirect to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/marketplace/:path*',
    '/auth/:path*',
    //'/api/:path*',
    // Exclude API routes from middleware to prevent redirect loops
    // '/api/auth/me',
  ],
};
