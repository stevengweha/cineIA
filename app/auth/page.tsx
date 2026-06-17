// app/auth/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedCGU, setAcceptedCGU] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LOGIQUE TYPING EFFECT
  const [typedTitle, setTypedTitle] = useState('');
  const router = useRouter();

  const titleText = isLogin 
    ? "Prêt pour votre prochain coup de cœur ?" 
    : "L'IA trouve le film parfait pour vous.";

  useEffect(() => {
    let i = 0;
    setTypedTitle('');
    const interval = setInterval(() => {
      setTypedTitle(titleText.slice(0, i + 1));
      i++;
      if (i >= titleText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [isLogin, titleText]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
        body: JSON.stringify({ 
          username, 
          password, 
          acceptedCGU: !isLogin ? acceptedCGU : undefined 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // min-h-dvh (au lieu de min-h-screen) + overflow-y-auto : le conteneur reste
    // centré normalement, mais devient scrollable si le clavier mobile réduit
    // le viewport visible (sinon le bouton "Se connecter" peut devenir inatteignable).
    // overflow-x-hidden évite tout débordement horizontal causé par le halo flou.
    <div className="min-h-dvh w-full flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden p-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-black relative">
      {/* BACKGROUND CORRIGÉ (ajout bg-black pour le chargement) */}
      <div className="absolute inset-0 bg-black bg-[url('/bk.jpg')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-500/10 blur-[100px] rounded-full" />

      {/* HERO CONTENT */}
      <div className="relative z-10 text-center mb-6 max-w-sm px-2 w-full">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight min-h-[2.5em] flex items-center justify-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
            {typedTitle}
          </span>
        </h1>
        <p className="text-gray-400 text-sm md:text-lg font-medium leading-relaxed">
          {isLogin 
            ? "Retrouvez vos recommandations personnalisées instantanément."
            : "Fini les heures de recherche. Inscrivez-vous pour obtenir vos suggestions sur-mesure."
          }
        </p>
      </div>

      {/* AUTH CARD */}
      <div className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">
            {isLogin ? 'Bon retour' : 'Créer mon compte'}
          </h2>
          <p className="text-xs text-gray-400">
            {isLogin ? 'Connectez-vous pour reprendre vos recommandations.' : 'Entrez vos informations pour démarrer.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider ml-1">Nom d'utilisateur</label>
            <input
              type="text"
              required
              placeholder="ex: cinephile92"
              // CORRECTION ZOOM IOS : text-base sur mobile, text-sm sur desktop
              className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-base md:text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider ml-1">Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              // CORRECTION ZOOM IOS : text-base sur mobile, text-sm sur desktop
              className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-base md:text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {!isLogin && (
            <div className="flex items-center gap-2 mt-2 mb-2">
              <input
                type="checkbox"
                id="cgu"
                checked={acceptedCGU}
                onChange={(e) => setAcceptedCGU(e.target.checked)}
                className="w-4 h-4 shrink-0 rounded border-white/10 bg-black/50 text-red-500 focus:ring-red-500/50 cursor-pointer"
              />
              <label htmlFor="cgu" className="text-[11px] text-gray-400 cursor-pointer">
                J'accepte les <Link href="/cgu" className="text-red-400 font-bold hover:text-red-300">CGU</Link>
              </label>
            </div>
          )}

          <button
            disabled={loading || (!isLogin && !acceptedCGU)}
            className={`
              w-full py-3 rounded-xl font-bold text-sm text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]
              ${(loading || (!isLogin && !acceptedCGU))
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-red-600 to-purple-600 shadow-lg shadow-red-500/20'}
            `}
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
            <span className="ml-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
              {isLogin ? 'S\'inscrire' : 'Se connecter'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}