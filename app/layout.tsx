import type { Metadata, Viewport } from 'next';
import { Inter, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SEOHead } from '@/components/SEO';

// Fusion des polices
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ec4899',
};

export const metadata: Metadata = {
  title: 'Fleur Sucrée - Élixirs Naturels Premium | Florence 2026',
  description: 'Découvrez nos élixirs naturels premium pour éveiller vos sens. Produits artisanaux de haute qualité, livraison rapide en Europe.',
  keywords: ['élixirs naturels', 'produits artisanaux', 'Florence', 'parfums naturels', 'wellbeing'],
  authors: [{ name: 'Fleur Sucrée' }],
  creator: 'Fleur Sucrée',
  publisher: 'Fleur Sucrée',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://florencesite2026.netlify.app/',
    siteName: 'Fleur Sucrée',
    title: 'Fleur Sucrée - Élixirs Naturels Premium',
    description: 'Découvrez nos élixirs naturels premium pour éveiller vos sens',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fleur Sucrée - Élixirs Naturels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fleur Sucrée - Élixirs Naturels Premium',
    description: 'Découvrez nos élixirs naturels premium pour éveiller vos sens',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://siteflorence2026.com',
    languages: {
      'fr-FR': 'https://siteflorence2026.com',
      'en-US': 'https://siteflorence2026.com/en',
    },
  },
  verification: {
    google: '98bf490ecdc90851', // Code corrigé - UNIQUEMENT ici
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <SEOHead />
        {/* La balise meta est SUPPRIMÉE - Next.js la génère automatiquement via metadata.verification */}
      </head>
      <body 
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}