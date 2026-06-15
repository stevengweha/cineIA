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
  overview?: string
  release_date?: string
  sentiment?: string
  sentiment_score?: number
}

export default function CataloguePage() {
  const { user } = useAuthStore()

  // État Catalogue
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  // État Recherche
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchingLoading, setSearchingLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. Logique Catalogue (Pagination)
  useEffect(() => {
    const loadMovies = async () => {
      if (isSearching) return
      setLoading(true)
      try {
        const data = await catalogueAPI.getMovies(20, (page - 1) * 20)
        setMovies(data.movies)
      } catch {
        setError('Erreur lors du chargement des films')
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [page, isSearching])

  // 2. Logique Recherche (Debounce)
  useEffect(() => {
    if (query.trim().length < 2) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const debounce = setTimeout(async () => {
      setSearchingLoading(true)
      try {
        const data = await catalogueAPI.searchMovies(query)
        setSearchResults(data.movies || [])
      } catch (err) {
        console.error(err)
        setError('Une erreur est survenue lors de la recherche.')
      } finally {
        setSearchingLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  const displayMovies = isSearching ? searchResults : movies

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-500/10 blur-[140px]" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/10 blur-[140px]" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-6xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {isSearching ? '🔍 Résultats de recherche' : '🎬 Catalogue CineMatch'}
            </h1>
            <input
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Rechercher un titre..."
              className="mt-6 w-full md:w-96 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>
        </section>

        {/* LOADING & CONTENT */}
        {(loading || searchingLoading) ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {displayMovies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={{ ...movie, sentiment: movie.sentiment || 'NEUTRAL', sentiment_score: movie.sentiment_score || 0.5 }} 
                userId={user?.id || 0} 
              />
            ))}
          </div>
        )}

        {/* PAGINATION (uniquement si pas en recherche) */}
        {!isSearching && !loading && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500 disabled:opacity-40 transition">← Précédent</button>
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 font-bold">{page}</div>
            <button onClick={() => setPage(p => p + 1)} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500 transition">Suivant →</button>
          </div>
        )}
      </div>
    </div>
  )
}