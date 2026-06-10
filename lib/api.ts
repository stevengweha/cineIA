import axios, { AxiosInstance } from 'axios'

// Le frontend parle désormais exclusivement à Next.js via le chemin relatif /api
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Catalogue API ─────────────────────────────────────────────────────────
export const catalogueAPI = {
  getMovies: async (limit: number = 40, offset: number = 0) => {
    try {
      const response = await api.get('/movies', { params: { limit, offset } })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error)
      throw error
    }
  },

  searchMovies: async (q: string, limit: number = 20) => {
    try {
      const response = await api.get('/movies/search', { params: { q, limit } })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      throw error
    }
  },

  rateMovie: async (movieId: number, rating: number) => {
    try {
      // Correction ici : Envoi de 'movieId' pour correspondre à la validation du backend
      const response = await api.post('/ratings', {
        movieId,
        rating,
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la note:', error)
      throw error
    }
  },
}

// ── Recommendations API ───────────────────────────────────────────────────
export const recommendationAPI = {
  getRecommendations: async (userId: number) => {
    try {
      const response = await api.get('/recommendations', { params: { user_id: userId } })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error)
      throw error
    }
  },
}

// ── Sentiment API ─────────────────────────────────────────────────────────
export const sentimentAPI = {
  getMovieSentiment: async (movieId: number) => {
    try {
      const response = await api.get(`/movies/${movieId}/sentiment`)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la récupération du sentiment pour le film ${movieId}:`, error)
      throw error
    }
  },
}

// ── Chat RAG API ──────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: async (question: string, userId: number, chatHistory: [string, string][]) => {
    try {
      // Appelle la route Next.js proxy locale : /api/chat
      const response = await api.post('/chat', {
        question,
        user_id: userId,
        chat_history: chatHistory,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message au chatbot:', error);
      throw error;
    }
  },

  getHealth: async () => {
    try {
      // Pour le health check, on tape directement sur la route globale ou configurée
      const response = await api.get('/chat/health');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de la santé de l\'API:', error);
      throw error;
    }
  },
};

// ── Dashboard Stats API ───────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await api.get('/stats')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  },
}

// ── Authentication API ────────────────────────────────────────────────────
export const authAPI = {
  register: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      throw error
    }
  },

  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  },
}

export default api