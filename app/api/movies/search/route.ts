import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const query =
      req.nextUrl.searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({
        movies: [],
      })
    }

    const movies = await prisma.movies.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 50,
      orderBy: {
        vote_average: 'desc',
      },
    })

    return NextResponse.json({
      movies,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erreur serveur',
      },
      {
        status: 500,
      }
    )
  }
}