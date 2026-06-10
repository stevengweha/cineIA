'use client'

import { useState, useEffect } from 'react'
import { dashboardAPI } from '@/lib/api'

interface Stats {
  movies: number
  ratings: number
  users: number
  recommendations: number
  sentiment_scores: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardAPI.getStats()
        setStats(data)
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
          📊 Dashboard Pipeline
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
              {[
                { label: 'Films', value: stats.movies, icon: '🎬' },
                { label: 'Notes', value: stats.ratings, icon: '⭐' },
                { label: 'Utilisateurs', value: stats.users, icon: '👥' },
                { label: 'Recommandations', value: stats.recommendations, icon: '🎯' },
                { label: 'Scores Sentiment', value: stats.sentiment_scores, icon: '📈' },
              ].map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                  <div className="text-3xl font-bold text-red-400">{stat.value.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Services disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'API Chat HF', url: 'https://steve354545-cinematchia.hf.space' },
                  { name: 'API Docs', url: 'https://steve354545-cinematchia.hf.space/docs' },
                  { name: 'Airflow', url: 'http://localhost:8081' },
                  { name: 'MLflow', url: 'http://localhost:5000' },
                ].map((service, i) => (
                  <a
                    key={i}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300 hover:text-white"
                  >
                    {service.name}
                    <span className="ml-2">→</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">Erreur lors du chargement</div>
        )}
      </div>
    </div>
  )
}
