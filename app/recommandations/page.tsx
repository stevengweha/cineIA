'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { recommendationAPI } from '@/lib/api';
import MovieCard from '@/components/MovieCard';

// 1. Mise à jour de l'interface pour refléter la structure réelle de la BDD
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface Recommandation {
  id: number;
  score: number;
  movies: Movie; // L'objet imbriqué venant de Prisma
}

export default function RecommandationsPage() {
  const [recommendations, setRecommendations] = useState<Recommandation[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const initPage = async () => {
    setLoading(true);
    setError(null);
    try {
      // On lance les deux requêtes en même temps
      const [userRes, recData] = await Promise.all([
        axios.get('/api/auth/me'),
        recommendationAPI.getRecommendations()
      ]);

      setUserId(userRes.data.userId);
      setRecommendations(recData.recommendations || []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  initPage();
}, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              ⭐ Mes Recommandations
            </h1>
          </div>
        </div>

        {error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center font-medium">
            {error}
          </div>
        ) : loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-red-500"></div>
            <p className="text-gray-400 text-sm animate-pulse">Calcul de tes affinités cinématographiques...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center text-gray-400 bg-gray-900/20 border border-gray-900 rounded-2xl py-16 space-y-4">
            <p className="text-xl">🍿 Aucune recommandation disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="relative group rounded-2xl overflow-hidden">
                {/* 2. On passe l'objet imbriqué 'rec.movies' à ton MovieCard */}
                <MovieCard movie={rec.movies} userId={userId || 0} />
                
                <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-black tracking-wider shadow-md border border-red-500/30">
  {/* On divise par 5, puis on arrondit à l'entier le plus proche */}
  {Math.round((rec.score / 5) * 100)}% Match
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}