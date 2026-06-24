import { Metadata } from 'next';
import { metadata, siteConfig } from '@/lib/seo-config';

export const dynamicParams = true;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: metadata.dashboard.title,
    description: metadata.dashboard.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${siteConfig.url}/dashboard`,
    },
  };
}

export default function DashboardMetadata() {
  return null;
}
