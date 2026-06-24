import { Metadata } from 'next';
import { metadata, siteConfig } from '@/lib/seo-config';

export const dynamicParams = true;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: metadata.register.title,
    description: metadata.register.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${siteConfig.url}/auth/register`,
    },
  };
}

export default function RegisterMetadata() {
  return null;
}
