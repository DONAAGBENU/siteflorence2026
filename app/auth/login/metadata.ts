import { Metadata } from 'next';
import { metadata, siteConfig } from '@/lib/seo-config';

export const dynamicParams = true;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: metadata.login.title,
    description: metadata.login.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${siteConfig.url}/auth/login`,
    },
  };
}

export default function LoginMetadata() {
  return null;
}
