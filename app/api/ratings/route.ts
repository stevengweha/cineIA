import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function POST(req: NextRequest) {
    try {
        /*
        ==========================================
        AUTHENTIFICATION
        ==========================================
        */

        const cookieStore = await cookies()

        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentification requise',
                },
                { status: 401 }
            )
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'super-secret-key'
        )

        const { payload } = await jwtVerify(
            token,
            secret
        )

        const userId = Number(payload.userId)

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Utilisateur invalide',
                },
                { status: 401 }
            )
        }

        /*
        ==========================================
        BODY
        ==========================================
        */

        const body = await req.json()

        const movieId = Number(body.movieId)
        const rating = Number(body.rating)

        if (!movieId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'movieId requis',
                },
                { status: 400 }
            )
        }

        if (
            Number.isNaN(rating) ||
            rating < 0.5 ||
            rating > 5
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        'La note doit être comprise entre 0.5 et 5',
                },
                { status: 400 }
            )
        }

        /*
        ==========================================
        FILM EXISTE ?
        ==========================================
        */

        const movie = await prisma.movies.findUnique({
            where: {
                id: movieId,
            },
        })

        if (!movie) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Film introuvable',
                },
                { status: 404 }
            )
        }

        /*
        ==========================================
        UPSERT RATING
        ==========================================
        */

        const savedRating =
            await prisma.ratings.upsert({
                where: {
                    user_id_movie_id: {
                        user_id: userId,
                        movie_id: movieId,
                    },
                },

                update: {
                    rating,
                },

                create: {
                    user_id: userId,
                    movie_id: movieId,
                    rating,
                },
            })

        return NextResponse.json({
            success: true,
            message: 'Note enregistrée',
            rating: savedRating,
        })
    } catch (error) {
        console.error(
            'Erreur API Rating:',
            error
        )

        return NextResponse.json(
            {
                success: false,
                error:
                    "Erreur interne lors de l'enregistrement",
            },
            { status: 500 }
        )
    }
}