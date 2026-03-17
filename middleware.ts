import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'planmob_session';

function getValidSession(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE);
  if (!cookie) return null;
  try {
    const data = JSON.parse(cookie.value);
    if (data && data.userId && data.role) return data;
    return null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getValidSession(request);

  // Public routes — no auth required
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/recuperar-senha') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/export') ||
    pathname === '/'
  ) {
    // Redirect logged-in users away from login
    if (session && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require auth
  if (!session) {
    // Clear any invalid cookie before redirecting
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  // Admin routes — require admin role
  if (pathname.startsWith('/admin')) {
    if (session.role !== 'administrador') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logos/).*)',
  ],
};
