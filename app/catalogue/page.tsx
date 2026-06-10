'use client'

import { useState, useEffect, useMemo } from 'react'
import { catalogueAPI } from '@/lib/api'
import MovieCard from '@/components/MovieCard'
import { useAuthStore } from '@/store/auth'

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  overview: string
  release_date: string
  sentiment: string
  sentiment_score: number
}

export default function CataloguePage() {
  const { user } = useAuthStore()

  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      setError('')

      try {
        const limit = 20
        const offset = (page - 1) * limit

        const data = await catalogueAPI.getMovies(
          limit,
          offset
        )

        setMovies(data.movies)
      } catch {
        setError('Erreur lors du chargement des films')
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [page])

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [movies, search])

  return (
    <div className="min-h-screen p-4 md:p-8">

      <div className="max-w-[1600px] mx-auto space-y-8">

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
          <div className="absolute inset-0 overflow-hidden">

            <div
              className="
                absolute
                -top-20
                -right-20
                w-96
                h-96
                bg-red-500/10
                blur-[140px]
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
                blur-[140px]
              "
            />

          </div>

          <div className="relative z-10">

            <h1
              className="
                text-3xl
                sm:text-4xl
                md:text-6xl
                font-black
                tracking-tight
                bg-gradient-to-r
                from-red-500
                via-pink-500
                to-purple-500
                bg-clip-text
                text-transparent
              "
            >
              🎬 Catalogue CineMatch
            </h1>

            <p
              className="
                mt-4
                text-gray-400
                max-w-2xl
                text-sm
                md:text-lg
              "
            >
              Découvrez les films les plus populaires,
              notez vos favoris et laissez l'IA apprendre
              vos goûts cinématographiques.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                "
              >
                <p className="text-xs text-gray-500">
                  Films affichés
                </p>
                <p className="font-bold">
                  {filteredMovies.length}
                </p>
              </div>

              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                "
              >
                <p className="text-xs text-gray-500">
                  Page
                </p>
                <p className="font-bold">
                  {page}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SEARCH */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-4
            justify-between
            items-start
            md:items-center
          "
        >
          <h2 className="text-2xl font-bold">
            Tous les films
          </h2>

          <input
            type="text"
            placeholder="🔍 Rechercher un film..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              md:w-96
              px-5
              py-3
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
              placeholder:text-gray-500
              focus:outline-none
              focus:border-red-500
              transition
            "
          />
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              p-4
              rounded-2xl
              bg-red-500/10
              border
              border-red-500/20
              text-red-300
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
              xl:grid-cols-5
              2xl:grid-cols-6
              gap-4
              md:gap-6
            "
          >
            {Array.from({ length: 20 }).map(
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
            {/* GRID */}

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6
                gap-4
                md:gap-6
              "
            >
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  userId={user?.id || 0}
                />
              ))}
            </div>

            {/* EMPTY STATE */}

            {filteredMovies.length === 0 && (
              <div
                className="
                  text-center
                  py-20
                "
              >
                <h3 className="text-xl font-bold">
                  Aucun résultat
                </h3>

                <p className="text-gray-500 mt-2">
                  Essayez une autre recherche.
                </p>
              </div>
            )}

            {/* PAGINATION */}

            <div
              className="
                flex
                justify-center
                items-center
                gap-3
                mt-12
                flex-wrap
              "
            >
              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.max(1, prev - 1)
                  )
                }
                disabled={page === 1}
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                  hover:border-red-500
                  disabled:opacity-40
                  transition
                "
              >
                ← Précédent
              </button>

              <div
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-red-600
                  to-pink-600
                  font-bold
                "
              >
                {page}
              </div>

              <button
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                  hover:border-red-500
                  transition
                "
              >
                Suivant →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}