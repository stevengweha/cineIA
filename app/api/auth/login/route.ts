import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 1. ROBUSTESSE : Validation stricte de la présence ET du type de données
    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 400 });
    }

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

    // 2. ROBUSTESSE & SÉCURITÉ : On retire la clé par défaut vulnérable
    const secretString = process.env.JWT_SECRET;
    if (!secretString) {
      throw new Error("CRITIQUE: JWT_SECRET n'est pas défini sur le serveur");
    }

    // 3. Création du Token JWT (valide 24h)
    const secret = new TextEncoder().encode(secretString);
    const token = await new SignJWT({ userId: user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // 4. Création de la réponse avec le Cookie sécurisé
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