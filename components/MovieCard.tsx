'use client'

import { useState } from 'react'
import Image from 'next/image'
import MovieDetailsModal from './MovieDetailsModal'

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string
    vote_average: number
    overview?: string
    release_date?: string
    sentiment?: string
    sentiment_score?: number
  }
  userId: number
}

const TMDB_IMG =
  process.env.NEXT_PUBLIC_TMDB_IMG ||
  'https://image.tmdb.org/t/p/w500'

export default function MovieCard({
  movie,
  userId,
}: MovieCardProps) {
  const [open, setOpen] = useState(false)

  const sentimentEmoji: Record<string, string> = {
    POSITIVE: '😍',
    NEUTRAL: '😐',
    NEGATIVE: '😞',
  }

  return (
    <>
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          bg-white/5
          border
          border-white/10
          backdrop-blur-xl
          transition-all
          duration-500
          hover:scale-[1.03]
          hover:border-red-500/40
          hover:shadow-[0_0_40px_rgba(239,68,68,0.25)]
        "
      >
        <div className="relative aspect-[2/3] overflow-hidden">

          {movie.poster_path ? (
            <Image
              src={`${TMDB_IMG}${movie.poster_path}`}
              alt={movie.title}
              fill
              className="
                object-cover
                transition-transform
                duration-700
                group-hover:scale-110
              "
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-500">
              No Image
            </div>
          )}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black
              via-black/40
              to-transparent
            "
          />

          <div className="absolute top-3 left-3">
            <span
              className="
                px-2
                py-1
                rounded-full
                bg-black/60
                backdrop-blur
                text-xs
                font-bold
              "
            >
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
          </div>

          {movie.sentiment && (
            <div className="absolute top-3 right-3 text-2xl">
              {sentimentEmoji[movie.sentiment] ?? '😐'}
            </div>
          )}

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              p-4
            "
          >
            <h3
              className="
                font-bold
                text-lg
                line-clamp-2
                text-white
              "
            >
              {movie.title}
            </h3>
          </div>

        </div>

        <div className="p-4">
          <button
            onClick={() => setOpen(true)}
            className="
              w-full
              py-3
              rounded-xl
              font-bold
              text-white
              bg-gradient-to-r
              from-red-600
              to-pink-600
              hover:opacity-90
              transition-all
              duration-300
            "
          >
            Voir les détails
          </button>
        </div>

      </div>

      <MovieDetailsModal
        movie={movie}
        userId={userId}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}