// app/ClientLayout.tsx
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserSession {
  id: number;
  username: string;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (pathname === '/auth' || pathname === '/cgu') {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          router.push('/auth');
        }
      } catch {
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/auth');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { href: '/catalogue', icon: '🎬', label: 'Catalogue' },
    { href: '/recommandations', icon: '⭐', label: 'Recommandations' },
    { href: '/chatbot', icon: '💬', label: 'CineIA' },
  ];

  if (pathname === '/auth' || pathname === '/cgu') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-black px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          <p className="text-gray-400">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  return (
    // min-h-dvh au lieu de min-h-screen : tient compte du redimensionnement
    // de la barre d'adresse sur mobile (iOS/Android)
    <div className="min-h-dvh bg-black overflow-x-hidden">
      {/* HEADER MOBILE — la hauteur intègre maintenant le safe-area-inset (encoche)
          au lieu d'une hauteur fixe écrasée par le padding */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 h-[calc(4rem_+_env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]"
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl p-2 -ml-2 leading-none"
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
        <h1 className="font-black text-xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          CineMatch
        </h1>
        <div className="w-8 h-8 shrink-0 rounded-full bg-red-500 flex items-center justify-center font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-dvh">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed lg:relative top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-black/70 backdrop-blur-2xl border-r border-white/10 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          `}
        >
          <div className="h-full flex flex-col justify-between p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-10">
                <h1 className="font-black text-3xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  CineMatch
                </h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-xl p-2 -mr-2"
                  aria-label="Fermer le menu"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300
                        ${active ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase">Connecté</p>
                  <p className="font-semibold truncate max-w-[150px]">{user?.username}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full rounded-xl py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition font-semibold"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN — le padding-top correspond exactement à la hauteur réelle du header
            (4rem + safe-area), évitant le trou ou le chevauchement constaté avant */}
        <main className="flex-1 w-full min-w-0 pt-[calc(4rem_+_env(safe-area-inset-top))] lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}