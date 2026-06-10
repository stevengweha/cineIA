'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

const nav = [
  { href: '/catalogue', label: '🎬 Catalogue' },
  { href: '/search', label: '🔍 Recherche' },
  { href: '/recommendations', label: '⭐ Recommandations' },
  { href: '/chatbot', label: '💬 Chatbot' },
  { href: '/dashboard', label: '📊 Dashboard' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 p-6 flex flex-col h-screen fixed left-0 top-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 mb-2">
          🎬 CineMatch
        </h1>
        <p className="text-gray-400 text-xs">v2.0.0</p>
      </div>

      {user && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-xs">Connecté en tant que</p>
          <p className="text-red-400 font-bold">{user.username}</p>
        </div>
      )}

      <nav className="flex-1 space-y-2">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`block px-4 py-3 rounded-lg transition font-medium ${
              pathname === href
                ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition font-bold"
      >
        Déconnexion
      </button>
    </aside>
  )
}
