import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.users.findUnique({
      where: { username: username }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    // 1. Création du Token JWT (valide 24h)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key');
    const token = await new SignJWT({ userId: user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // 2. Création de la réponse avec le Cookie sécurisé
    const response = NextResponse.json({ success: true });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true, // Le cookie n'est pas accessible via JS (protection XSS)
      secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 heures
    });

    return response;

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}