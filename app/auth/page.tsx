'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    // 1. Lire TOUJOURS le JSON une seule fois, quel que soit le statut HTTP
    const data = await res.json();

    // 2. Traiter le résultat avec cette variable unique 'data'
    if (!res.ok) {
      throw new Error(data.error || "Erreur lors de l'authentification");
    }

    // Succès
    router.push('/');
    router.refresh();
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
  <div 
  className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-950"
>
  {/* Couche image avec opacité pour masquer le manque de netteté */}
  <div 
    className="absolute inset-0 bg-cover bg-center opacity-70" 
    style={{ backgroundImage: "url('/bk.jpg')" }} 
  />
    Overlay sombre pour garder la lisibilité du texte
    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

    {/* Conteneur pour le titre au-dessus de la carte */}
    <div className="relative z-10 text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
        On regarder quoi ce soir ?
      </h1>
      <p className="text-gray-300 text-lg">
        Rejoins nous pour accéder à des recommandations personnalisées.
      </p>
    </div>

    {/* Ta CARTE actuelle, ajout de relative z-10 pour qu'elle passe au-dessus du fond */}
    <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-8">
      
      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">
          {isLogin ? 'Connexion' : 'Inscription'}
        </h2>
      

          <p className="text-sm text-gray-400 mt-2">
            CineMatch — découvre, note et recommande des films. <br />
            L'IA apprend de tes goûts pour te suggérer les meilleurs films.
          
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-4">

          <input
            type="text"
            required
            placeholder="Nom d'utilisateur"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />

          <input
            type="password"
            required
            placeholder="Mot de passe"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button
            disabled={loading}
            className={`
              w-full py-3 rounded-xl font-semibold transition-all
              flex items-center justify-center gap-2
              ${loading
                ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white'
              }
            `}
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>

        {/* SWITCH */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            {isLogin
              ? "Pas encore de compte ? S'inscrire"
              : "Déjà un compte ? Se connecter"}
          </button>
        </div>

      </div>
    </div>
  );
}