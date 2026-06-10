import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '40', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  try {
    const movies = await prisma.movies.findMany({
      take: limit,
      skip: offset,
      orderBy: { ingested_at: 'desc' },
    });

    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Erreur Prisma Catalogue:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des films' }, { status: 500 });
  }
}