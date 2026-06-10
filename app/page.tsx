import { prisma } from '@/lib/prisma';
import Link from 'next/link';
// import MovieDetailsModal from './MovieDetailsModal'


// Fonction pour récupérer les films (Server Component)
async function getRecentMovies() {
  return await prisma.movies.findMany({
    take: 10,
    orderBy: { ingested_at: 'desc' },
  });
}

export default async function HomePage() {
  const movies = await getRecentMovies();

  // Fonction utilitaire pour formater l'URL du poster de manière stable
  const getPosterUrl = (posterPath: string | null) => {
    if (!posterPath) return '/placeholder.png';
    
    // Si l'URL stockée est déjà complète (http...), on la retourne directement
    if (posterPath.startsWith('http')) return posterPath;
    
    // On récupère l'URL de base (ex: définie dans ton .env) ou un fallback TMDB robuste
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_IMG || 'https://image.tmdb.org/t/p/w500';
    
    // On s'assure qu'il y a un seul slash '/' entre l'URL de base et le nom du fichier
    const cleanPath = posterPath.startsWith('/') ? posterPath : `/${posterPath}`;
    
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 space-y-10">
      
      {/* Header avec bienvenue (Style Hero Banner) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-700">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">
            Bienvenue sur CineMatch 🎬
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
            L'IA qui connaît tes goûts mieux que toi. Découvre les derniers ajouts sélectionnés spécialement pour ton profil.
          </p>
        </div>
        
        {/* Élément décoratif en arrière-plan */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </section>

      {/* Grille de films */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-100">Derniers ajouts</h2>
          <span className="text-sm font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full">Nouveautés</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="group flex flex-col bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20"
            >
              {/* Conteneur de l'image avec un ratio 2:3 parfait pour les affiches */}
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-900">
                <img 
                  src={getPosterUrl(movie.poster_path)} 
                  alt={movie.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {/* Voile dégradé noir en bas de l'image pour le style */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Contenu de la carte */}
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-100 line-clamp-1 mb-3" title={movie.title}>
                  {movie.title}
                </h3>
                
                {/* Bouton repoussé vers le bas avec mt-auto */}
                <Link 
                  href={`/catalogue/${movie.id}`}
                  className="mt-auto w-full py-2.5 px-4 bg-gray-700/50 text-gray-300 font-semibold text-sm text-center rounded-xl hover:bg-red-600 hover:text-white transition-colors border border-gray-600 hover:border-transparent"
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}