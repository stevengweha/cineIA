'use client';

import { useState, useEffect } from 'react';
import { recommendationAPI } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import { useAuthStore } from '@/store/auth';

interface Recommendation {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  score: number;
  sentiment: string;
}

export default function RecommendationsPage() {
  const { user } = useAuthStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await recommendationAPI.getRecommendations(user.id);
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Erreur lors du chargement des recommandations:', err);
        setError('Impossible de charger tes recommandations pour le moment.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête de la page */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
              ⭐ Mes Recommandations
            </h1>
            {user && (
              <p className="text-gray-400 text-sm mt-1">
                Générées par IA spécifiquement pour <span className="text-red-400 font-semibold">{user.username || `#${user.id}`}</span>
              </p>
            )}
          </div>
        </div>

        {/* Retour visuel en cas d'erreur */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Écran de chargement animé */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-red-500"></div>
            <p className="text-gray-400 text-sm animate-pulse">Calcul de tes affinités cinématographiques...</p>
          </div>
        ) : recommendations.length === 0 ? (
          /* Liste vide (Pas encore de notes enregistrées) */
          <div className="text-center text-gray-400 bg-gray-900/20 border border-gray-900 rounded-2xl py-16 space-y-4">
            <p className="text-xl">🍿 Aucune recommandation disponible</p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Notre IA a besoin de connaître tes goûts ! Explore le catalogue et laisse des avis ou des notes sur tes films préférés pour débloquer tes suggestions personnalisées.
            </p>
          </div>
        ) : (
          /* Grille des résultats avec affichage du score de pertinence */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="relative group rounded-2xl overflow-hidden">
                
                {/* Carte de film standardisée */}
                <MovieCard movie={rec as any} userId={user?.id || 0} />
                
                {/* Badge de score de correspondance stylisé en haut à droite */}
                <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-black tracking-wider shadow-md border border-red-500/30">
                  {(rec.score * 100).toFixed(0)}% Match
                </div>
                
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}