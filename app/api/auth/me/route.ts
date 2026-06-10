import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Décodage et vérification du JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key');
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        id: payload.userId,
        username: payload.username,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Session expirée ou invalide' }, { status: 401 });
  }
}