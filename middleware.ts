import type { NextRequest } from 'next/server';
import { isAuthenticated } from './app/utils/auth';

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get('jwt-token')?.value;
  const isAuthenticate = isAuthenticated(jwtToken);

  if (!isAuthenticate) {
    request.cookies.delete('jwt-token');
  }
  if (isAuthenticate && request.nextUrl.pathname.startsWith('/auth')) {
    return Response.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
