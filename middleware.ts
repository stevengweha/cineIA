import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 1. Initialisation EN DEHORS du middleware (singleton pour la performance)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

// 2. Middleware doit être async pour le 'await ratelimit.limit(ip)'
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Limitation UNIQUEMENT sur l'API de chat 
  if (pathname === '/api/chat') {
    const ip = request.ip ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip); 

    if (!success) {
      return NextResponse.json(
        { error: "Limite de requêtes atteinte. Réessayez plus tard." },
        { status: 429 }
      );
    }
  }

  // Tes exclusions pour les assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg')
  ) {
    return NextResponse.next();
  }

  // Redirections Auth
  if (!token && pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth/.*|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};