'use client'

import { useState } from 'react'
import Image from 'next/image'
import { catalogueAPI } from '@/lib/api'

const TMDB_IMG =
    process.env.NEXT_PUBLIC_TMDB_IMG ||
    'https://image.tmdb.org/t/p/w500'

interface Props {
    movie: any
    userId: number
    isOpen: boolean
    onClose: () => void
}

export default function MovieDetailsModal({
    movie,
    isOpen,
    onClose,
}: Props) {
    const [rating, setRating] = useState(3)
    const [loading, setLoading] = useState(false)
    const [rated, setRated] = useState(false)

    if (!isOpen) return null

    const handleRate = async () => {
        setLoading(true)

        try {
            await catalogueAPI.rateMovie(
                movie.id,
                rating
            )

            setRated(true)

            setTimeout(() => {
                setRated(false)
            }, 2500)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className="
          relative
          z-10
          w-full
          max-w-5xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-gray-950
          border
          border-white/10
        "
            >
                <button
                    onClick={onClose}
                    className="
            absolute
            right-4
            top-4
            z-20
            h-10
            w-10
            rounded-full
            bg-black/50
          "
                >
                    ✕
                </button>

                <div className="grid md:grid-cols-[320px_1fr] gap-8 p-6">

                    <div className="relative aspect-[2/3] overflow-hidden rounded-3xl">
                        <Image
                            src={`${TMDB_IMG}${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-6">

                        <div>
                            <h2 className="text-4xl font-black">
                                {movie.title}
                            </h2>

                            <div className="flex gap-4 mt-3 text-gray-400">
                                <span>
                                    ⭐ {movie.vote_average?.toFixed(1)}
                                </span>

                                {movie.release_date && (
                                    <span>
                                        📅 {movie.release_date}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2">
                                Synopsis
                            </h3>

                            <p className="text-gray-400 leading-relaxed">
                                {movie.overview ||
                                    'Aucun synopsis disponible.'}
                            </p>
                        </div>

                        <div className="border-t border-white/10 pt-6">

                            <h3 className="font-bold mb-4">
                                Noter ce film
                            </h3>

                            <div className="flex flex-col md:flex-row gap-3">

                                <select
                                    value={rating}
                                    onChange={(e) =>
                                        setRating(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    className="
                    rounded-xl
                    bg-white/10
                    border
                    border-white/10
                    px-4
                    py-3
                  "
                                >
                                    {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
                                        (r) => (
                                            <option
                                                key={r}
                                                value={r}
                                                className="bg-gray-900"
                                            >
                                                {r} ⭐
                                            </option>
                                        )
                                    )}
                                </select>

                                <button
                                    onClick={handleRate}
                                    disabled={loading}
                                    className={`
                    px-6
                    py-3
                    rounded-xl
                    font-bold

                    ${rated
                                            ? 'bg-green-600'
                                            : 'bg-gradient-to-r from-red-600 to-pink-600'
                                        }
                  `}
                                >
                                    {rated
                                        ? '✓ Film noté'
                                        : loading
                                            ? 'Chargement...'
                                            : 'Noter'}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}