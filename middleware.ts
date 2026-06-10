import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Si on essaie d'accéder à l'app sans token, on renvoie vers /auth
  if (!token && pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Si on est déjà connecté et qu'on essaie d'aller sur /auth, on renvoie vers l'accueil
  if (token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// On protège toutes les routes SAUF les assets, l'API d'auth et le favicon
export const config = {
  // On exclut tout ce qui commence par /api/auth/ ET les dossiers statiques
  matcher: ['/((?!api/auth/.*|_next/static|_next/image|favicon.ico).*)'],
};