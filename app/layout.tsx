import { Metadata } from 'next';
import './globals.css';
import { Analytics } from "@vercel/analytics/next";
import ClientLayout from './ClientLayout'; // Import du composant client

export const metadata: Metadata = {
  title: 'CineMatch - Vos recommandations de films', 
  description: 'Découvrez des films recommandés par notre IA en fonction de vos goûts et de vos notes.',
  keywords: ['films', 'recommandations', 'cinéma', 'IA', 'CineMatch'],
  authors: [{ name: 'CineMatch Team', url: 'https://www.cinematchia.online/' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      {/* Le body reste côté serveur, on lui donne juste les couleurs de fond de base */}
      <body className="bg-[#030712] text-white">
        
        {/* On délègue toute la logique interactive au composant Client */}
        <ClientLayout>
          {children}
        </ClientLayout>

        <Analytics />
      </body>
    </html>
  );
}