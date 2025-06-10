import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!token;
  const isOnDashboard = pathname.startsWith('/dashboard');

  if (isOnDashboard) {
    if (isLoggedIn) {
      // Allow access to dashboard if logged in
      return NextResponse.next();
    }
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  } else if (isLoggedIn) {
    // If the user is logged in, redirect them from the login page to the dashboard
    if (pathname.startsWith('/auth/login')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};