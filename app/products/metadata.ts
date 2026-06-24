import { Metadata } from 'next';
import { metadata, siteConfig } from '@/lib/seo-config';

export function generateMetadata(): Metadata {
  return {
    title: metadata.products.title,
    description: metadata.products.description,
    keywords: metadata.products.keywords,
    alternates: {
      canonical: `${siteConfig.url}/products`,
    },
    openGraph: {
      type: 'website',
      url: `${siteConfig.url}/products`,
      title: metadata.products.title,
      description: metadata.products.description,
      images: [
        {
          url: `${siteConfig.url}${metadata.products.ogImage}`,
          width: 1200,
          height: 630,
          alt: 'Nos Produits - Fleur Sucrée',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.products.title,
      description: metadata.products.description,
      images: [`${siteConfig.url}${metadata.products.ogImage}`],
    },
  };
}

export default function ProductsMetadata() {
  return null;
}
