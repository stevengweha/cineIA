'use client'

import { useState, useEffect } from 'react'
import { catalogueAPI } from '@/lib/api'
import MovieCard from '@/components/MovieCard'
import { useAuthStore } from '@/store/auth'

interface Movie {
id: number
title: string
poster_path: string
vote_average: number
}

export default function SearchPage() {
const { user } = useAuthStore()

const [query, setQuery] = useState('')
const [movies, setMovies] = useState<Movie[]>([])
const [loading, setLoading] = useState(false)
const [searched, setSearched] = useState(false)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
const debounce = setTimeout(async () => {
if (query.trim().length < 2) {
setMovies([])
setSearched(false)
return
}


  setLoading(true)
  setError(null)

  try {
    const data = await catalogueAPI.searchMovies(query)

    setMovies(data.movies || [])
    setSearched(true)
  } catch (err) {
    console.error(err)

    setMovies([])
    setError(
      'Une erreur est survenue lors de la recherche.'
    )
  } finally {
    setLoading(false)
  }
}, 300)

return () => clearTimeout(debounce)


}, [query])

return ( <div className="min-h-screen p-4 md:p-8">


  <div className="max-w-7xl mx-auto space-y-8">

    {/* HERO */}

    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        md:p-10
      "
    >
      <div
        className="
          absolute
          -top-20
          -right-20
          w-96
          h-96
          bg-red-500/10
          blur-[150px]
        "
      />

      <div
        className="
          absolute
          -bottom-20
          -left-20
          w-96
          h-96
          bg-purple-500/10
          blur-[150px]
        "
      />

      <div className="relative z-10">

        <h1
          className="
            text-4xl
            md:text-6xl
            font-black
            bg-gradient-to-r
            from-red-500
            via-pink-500
            to-purple-500
            bg-clip-text
            text-transparent
          "
        >
          🔍 Recherche : trouver la pépite
        </h1>

        <p
          className="
            mt-4
            text-gray-400
            max-w-2xl
          "
        >
          Recherchez instantanément vos productions préférées dans le catalogue.
        </p>

      </div>
    </section>

    {/* SEARCH BAR */}

    <div
      className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-3
        backdrop-blur-xl
      "
    >
      <input
        type="text"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="🔍 Rechercher un film (minimum 2 caractères)..."
        className="
          w-full
          bg-transparent
          px-4
          py-3
          text-white
          placeholder:text-gray-500
          focus:outline-none
        "
      />
    </div>

    {/* RESULT COUNT */}

    {searched && !loading && (
      <div className="text-gray-400 text-sm">
        {movies.length} résultat(s) trouvé(s)
      </div>
    )}

    {/* ERROR */}

    {error && (
      <div
        className="
          p-4
          rounded-2xl
          bg-red-500/10
          border
          border-red-500/20
          text-red-400
        "
      >
        {error}
      </div>
    )}

    {/* LOADING */}

    {loading ? (
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-4
          md:gap-6
        "
      >
        {Array.from({ length: 10 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                aspect-[2/3]
                rounded-3xl
                bg-white/5
                animate-pulse
              "
            />
          )
        )}
      </div>
    ) : (
      <>
        {/* EMPTY STATE */}

        {searched &&
          movies.length === 0 &&
          !error && (
            <div
              className="
                text-center
                py-20
                rounded-3xl
                border
                border-white/10
                bg-white/5
              "
            >
              <div className="text-5xl mb-4">
                🍿
              </div>

              <h2 className="text-xl font-bold">
                Aucun film trouvé
              </h2>

              <p className="text-gray-500 mt-2">
                Essayez un autre titre.
              </p>
            </div>
          )}

        {/* RESULTS */}

        {movies.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              gap-4
              md:gap-6
            "
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={{
                  ...movie,
                  sentiment: 'NEUTRAL',
                  sentiment_score: 0.5,
                } as any}
                userId={user?.id || 0}
              />
            ))}
          </div>
        )}
      </>
    )}

  </div>
</div>


)
}
