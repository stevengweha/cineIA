/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Cela ignorera les erreurs de type lors du build Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Cela ignorera les erreurs de linting lors du build Vercel
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  
};

module.exports = nextConfig;
