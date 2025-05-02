import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;

  const url = request.nextUrl.clone();

  if (!token && url.pathname !== '/') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/lancamentos/:path*'],
};
