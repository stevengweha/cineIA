import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
// app/api/recommendations/route.ts
export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as number;

    const data = await prisma.recommendations.findMany({
      where: { user_id: userId },
      include: { movies: true },
      orderBy: { score: 'desc' },
      take: 10
    });
    // console.log('Recommandations récupérées pour userId:', userId, data);

    // On retourne explicitement la clé 'recommendations'
    return NextResponse.json({ recommendations: data });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}