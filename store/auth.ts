'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/lib/api'

export interface User {
  id: number
  username: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          if (!username.trim() || password.length < 3) {
            set({ error: 'Identifiants invalides', isLoading: false })
            return false
          }

          const data = await authAPI.login(username, password)
          
          if (data.id && data.username) {
            set({
              user: { id: data.id, username: data.username },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          }
          
          set({ error: 'Erreur d\'authentification', isLoading: false })
          return false
        } catch (err: any) {
          const errorMsg = err?.response?.data?.detail || 'Erreur de connexion'
          set({ error: errorMsg, isLoading: false })
          return false
        }
      },

      register: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          if (username.length < 3) {
            set({ error: 'Nom d\'utilisateur trop court (min 3 caractères)', isLoading: false })
            return false
          }
          
          if (password.length < 6) {
            set({ error: 'Mot de passe trop court (min 6 caractères)', isLoading: false })
            return false
          }

          const data = await authAPI.register(username, password)
          
          if (data.id && data.username) {
            set({
              user: { id: data.id, username: data.username },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          }
          
          set({ error: 'Erreur lors de l\'inscription', isLoading: false })
          return false
        } catch (err: any) {
          const errorMsg = err?.response?.data?.detail || 'Erreur d\'inscription. Cet utilisateur existe peut-être déjà.'
          set({ error: errorMsg, isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
