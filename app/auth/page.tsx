'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedCGU, setAcceptedCGU] = useState(false); // État booléen pour le RGPD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation RGPD : On bloque si on n'a pas le boolean true à l'inscription
    if (!isLogin && !acceptedCGU) {
      setError("Vous devez accepter les CGU pour continuer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // On envoie acceptedCGU pour le stockage côté backend
        body: JSON.stringify({ 
          username, 
          password, 
          acceptedCGU: !isLogin ? acceptedCGU : undefined 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* BACKGROUND PREMIUM */}
      <div className="absolute inset-0 bg-[url('/bk.jpg')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      
      {/* GLOW EFFECT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full" />

      {/* HERO CONTENT DYNAMIQUE */}
      <div className="relative z-10 text-center mb-10 max-w-lg">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          {isLogin ? (
            <>Prêt pour votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">prochain coup de cœur ?</span></>
          ) : (
            <>Ne scrollez plus <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">pendant des heures</span></>
          )}
        </h1>
        <p className="text-gray-400 text-lg font-medium">
          {isLogin 
            ? "Rejoignez CineMatch et laissez notre IA transformer votre façon de regarder des films."
            : "Laissez l'IA choisir pour vous. Créez votre profil en quelques secondes."
          }
        </p>
      </div>

      {/* AUTH CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Bon retour' : 'Créer mon compte'}
          </h2>
          <p className="text-sm text-gray-400">
            {isLogin ? 'Connectez-vous pour reprendre vos recommandations.' : 'Entrez vos informations pour démarrer.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom d'utilisateur</label>
            <input
              type="text"
              required
              placeholder="ex: cinephile92"
              className="w-full rounded-2xl bg-black/50 border border-white/10 px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl bg-black/50 border border-white/10 px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* CHECKBOX RGPD/CGU (Uniquement inscription) */}
          {!isLogin && (
            <div className="flex items-center gap-3 mt-4 mb-2">
              <input
                type="checkbox"
                id="cgu"
                checked={acceptedCGU}
                onChange={(e) => setAcceptedCGU(e.target.checked)}
                className="w-5 h-5 rounded border-white/10 bg-black/50 text-red-500 focus:ring-red-500/50 cursor-pointer"
              />
              <label htmlFor="cgu" className="text-sm text-gray-400 cursor-pointer">
                J'accepte les <Link href="/cgu" className="text-red-400 font-bold hover:text-red-300">
  CGU
</Link> et la politique de confidentialité.
              </label>
            </div>
          )}

          <button
            disabled={loading || (!isLogin && !acceptedCGU)}
            className={`
              w-full py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]
              ${(loading || (!isLogin && !acceptedCGU))
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-red-600 to-purple-600 shadow-lg shadow-red-500/20'}
            `}
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
            <span className="ml-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400 hover:from-red-300 hover:to-purple-300 transition-all duration-300">
              {isLogin ? 'S\'inscrire' : 'Se connecter'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}