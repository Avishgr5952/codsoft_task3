import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    // Check expiry
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('careerhub_token')?.value;
  const user = token ? decodeJwtPayload(token) : null;

  // 1. If user visits /login or /register while already authenticated, redirect to appropriate dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (user) {
      if (user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (user.role === 'RECRUITER') {
        return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
      } else if (user.role === 'CANDIDATE') {
        return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
      }
    }
  }

  // 2. Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== 'ADMIN') {
      if (user.role === 'RECRUITER') {
        return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
    }
  }

  // 3. Protect Recruiter routes
  if (pathname.startsWith('/recruiter')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== 'RECRUITER' && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
    }
  }

  // 4. Protect Candidate routes
  if (pathname.startsWith('/candidate')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== 'CANDIDATE' && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/admin/:path*', '/recruiter/:path*', '/candidate/:path*'],
};
