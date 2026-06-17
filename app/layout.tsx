// app/layout.tsx
import { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from "@vercel/analytics/next";
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'CineMatch - Vos recommandations de films',
  description: 'Découvrez des films recommandés par notre IA en fonction de vos goûts et de vos notes.',
  keywords: ['films', 'recommandations', 'cinéma', 'IA', 'CineMatch'],
  authors: [{ name: 'CineMatch Team', url: 'https://www.cinematchia.online/' }],
};

// Indispensable pour que env(safe-area-inset-*) fonctionne sur iOS (notch / Dynamic Island)
// et pour un rendu cohérent entre iOS, Android et desktop.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#030712',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      {/* overflow-x-hidden en garde-fou contre tout débordement horizontal sur mobile */}
      <body className="bg-[#030712] text-white overflow-x-hidden">
        <ClientLayout>
          {children}
        </ClientLayout>

        <Analytics />
      </body>
    </html>
  );
}