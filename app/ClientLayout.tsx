'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface UserSession {
  id: number;
  username: string;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      // 1. Liste des pages publiques
    const publicPaths = ['/auth', '/cgu', '/privacy'];
    
    // 2. Si on est sur une page publique, on arrête la vérification
    if (publicPaths.includes(pathname)) {
      setLoading(false); 
      return; 
    }
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
        else router.push('/auth');
      } catch { router.push('/auth'); }
      finally { setLoading(false); }
    };
    checkSession();
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth');
    router.refresh();
  };

  const navItems = [
    { href: '/catalogue', icon: '🎬', label: 'Catalogue' },
    { href: '/recommandations', icon: '⭐', label: 'Recommandations' },
    { href: '/chatbot', icon: '🤖', label: 'CineIA' },
  ];

  if (pathname === '/auth') return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER MOBILE (Top) */}
      <header className="lg:hidden fixed top-0 w-full z-40 h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
        <h1 className="font-black text-xl bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
          CineMatch
        </h1>
        
        {/* Profile Menu Mobile */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg"
          >
            {user?.username?.charAt(0).toUpperCase()}
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-black/90 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
              <p className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">Connecté</p>
              <p className="px-4 py-1 font-semibold">{user?.username}</p>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 mt-2 text-red-400 hover:bg-white/5 rounded-xl font-medium transition"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>

      {/* LAYOUT CONTAINER */}
      <div className="flex min-h-screen">
        
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 bg-black/70 border-r border-white/10 flex-col p-6">
          <div className="flex-1">
            <h1 className="font-black text-3xl mb-10 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              CineMatch
            </h1>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition ${pathname === item.href ? 'bg-gradient-to-r from-red-600 to-pink-600' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <button onClick={handleLogout} className="w-full rounded-xl py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition font-semibold">
            Déconnexion
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 lg:pl-72 pb-24 lg:pb-0 pt-20 lg:pt-0">
          {children}
        </main>
      </div>

      {/* BOTTOM BAR MOBILE */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-40 h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-around px-2 shadow-2xl">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`p-3 rounded-xl transition ${pathname === item.href ? 'bg-white/10 text-white' : 'text-gray-500'}`}
          >
            <span className="text-2xl">{item.icon}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}