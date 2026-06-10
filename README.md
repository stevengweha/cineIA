# CineMatch AI - Frontend Next.js

Application frontend moderne pour CineMatch AI, développée avec **Next.js 14**, **TypeScript**, et **Tailwind CSS**.

## 🚀 Features

- 🎬 **Catalogue complet** - Parcourez tous les films disponibles
- 🔍 **Recherche** - Trouvez vos films préférés rapidement
- ⭐ **Recommandations** - Recevez des recommandations personnalisées
- 💬 **Chatbot RAG** - Conversez avec CineIA pour des conseils
- 📊 **Dashboard** - Visualisez les statistiques en temps réel
- 🔐 **Authentification** - Système d'authentification simple et sécurisé

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm ou yarn

## 🛠️ Installation

```bash
# Clonez ou naviguez vers le dossier
cd front\ nextjs

# Installez les dépendances
npm install

# Configurez les variables d'environnement
# Créez un fichier .env.local avec :
NEXT_PUBLIC_API_URL=https://steve354545-cinematchia.hf.space
NEXT_PUBLIC_TMDB_IMG=https://image.tmdb.org/t/p/w200
```

## 🏃 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start

# Linting
npm run lint
```

L'application sera accessible sur **http://localhost:3000**

## 📁 Structure du projet

```
app/
├── globals.css           # Styles globaux
├── layout.tsx            # Layout principal
├── page.tsx              # Page d'authentification
├── catalogue/            # Catalogue de films
├── search/               # Recherche de films
├── chatbot/              # Chatbot RAG
├── recommendations/      # Recommandations personnalisées
└── dashboard/            # Dashboard statistiques

components/
├── Sidebar.tsx           # Navigation sidebar
├── MovieCard.tsx         # Carte film
├── ChatBubble.tsx        # Bulle de chat
└── ProtectedRoute.tsx    # Route protégée

lib/
└── api.ts                # Appels API

store/
└── auth.ts               # Gestion authentification (Zustand)
```

## 🔗 API Endpoints

L'application se connecte à votre API RAG sur Hugging Face Spaces :

- `GET /health` - Vérifier l'état de l'API
- `GET /movies` - Obtenir la liste des films
- `GET /movies/search` - Rechercher des films
- `POST /api/ratings` - Noter un film
- `GET /recommendations` - Obtenir les recommandations
- `POST /chat` - Discuter avec le chatbot
- `GET /stats` - Obtenir les statistiques

## 🎨 Design

- **Tailwind CSS** pour les styles
- **Gradient dynamiques** pour l'interface
- **Design responsive** mobile-first
- **Dark mode** par défaut

## 🔐 Authentification

L'authentification est gérée localement avec **Zustand** pour la persistance.

- Créez un compte avec un pseudo et mot de passe
- Les données sont sauvegardées dans localStorage
- Déconnexion disponible dans la sidebar

## 📦 Dépendances clés

- **Next.js 14** - Framework React
- **React 18** - Librairie UI
- **TypeScript** - Type safety
- **Tailwind CSS** - CSS utility-first
- **Axios** - HTTP client
- **Zustand** - État managment léger

## 🚀 Déploiement

### Sur Vercel (recommandé)

```bash
npm install -g vercel
vercel
```

### Sur un serveur custom

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

**API non accessible:**
- Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers la bonne URL
- Vérifiez que l'API est en cours d'exécution
- Vérifiez la connexion Internet

**CORS issues:**
- L'API doit avoir CORS activé
- Vérifiez `allow_origins: ["*"]` dans FastAPI

## 📝 License

MIT

## 👨‍💻 Auteur

CineMatch AI Team
