import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 1. Validation des champs requis
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Nom d'utilisateur et mot de passe requis" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // 2. Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { username: username }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ce nom d'utilisateur est déjà內部 pris" },
        { status: 400 }
      );
    }

    // 3. Hachage sécurisé du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Création de l'utilisateur en Base de Données
    const newUser = await prisma.users.create({
      data: {
        username: username,
        password_hash: hashedPassword
      }
    });

    // 5. Génération automatique du Token JWT (Valide 24h)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key');
    const token = await new SignJWT({ userId: newUser.id, username: newUser.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // 6. Création de la réponse avec le Cookie sécurisé (Auto-login)
    const response = NextResponse.json({ 
      success: true, 
      message: "Compte créé avec succès",
      user: { id: newUser.id, username: newUser.username }
    });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true, // Protection XSS
      secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 heures
    });

    return response;

  } catch (error) {
    console.error("Erreur API Register:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur lors de l'inscription" }, 
      { status: 500 }
    );
  }
}