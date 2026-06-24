import { Metadata } from 'next';
import { metadata, siteConfig } from '@/lib/seo-config';

export function generateMetadata(): Metadata {
  return {
    title: metadata.home.title,
    description: metadata.home.description,
    keywords: metadata.home.keywords,
    alternates: {
      canonical: siteConfig.url,
    },
    openGraph: {
      type: 'website',
      url: siteConfig.url,
      title: metadata.home.title,
      description: metadata.home.description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}${metadata.home.ogImage}`,
          width: 1200,
          height: 630,
          alt: 'Fleur Sucrée - Accueil',
        },
      ],
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitter,
      title: metadata.home.title,
      description: metadata.home.description,
      images: [`${siteConfig.url}${metadata.home.ogImage}`],
    },
  };
}

export default function HomeMetadata() {
  return null;
}
