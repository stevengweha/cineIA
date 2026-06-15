import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    // 1. Extraction des données incluant acceptedCGU
    const { username, password, acceptedCGU } = await req.json();

    // 2. Validation des champs requis et du consentement
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Nom d'utilisateur et mot de passe requis" },
        { status: 400 }
      );
    }

    if (acceptedCGU !== true) {
      return NextResponse.json(
        { success: false, error: "Vous devez accepter les CGU pour créer un compte" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // 3. Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { username: username }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ce nom d'utilisateur est déjà pris" },
        { status: 400 }
      );
    }

    // 4. Hachage sécurisé du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Création de l'utilisateur avec l'état du consentement
    const newUser = await prisma.users.create({
      data: {
        username: username,
        password_hash: hashedPassword,
        accepted_cgu: acceptedCGU, // Sauvegarde du consentement (true)
      }
    });

    // 6. Génération automatique du Token JWT
    const secretString = process.env.JWT_SECRET;
    if (!secretString) {
      throw new Error("JWT_SECRET n'est pas défini");
    }
    const secret = new TextEncoder().encode(secretString);

    const token = await new SignJWT({ userId: newUser.id, username: newUser.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // 7. Création de la réponse avec le Cookie sécurisé
    const response = NextResponse.json({ 
      success: true, 
      message: "Compte créé avec succès",
      user: { id: newUser.id, username: newUser.username }
    });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24
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