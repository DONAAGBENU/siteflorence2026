import { ReactNode } from 'react';

interface SEOHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Composant Heading optimisé pour le SEO
 * - Structure HTML correcte (h1, h2, h3, etc.)
 * - Améliore la hiérarchie des pages
 * - Bon pour les snippets Google
 */
export function SEOHeading({
  level,
  children,
  className = '',
  id,
}: SEOHeadingProps) {
  const Tag = `h${level}` as const;

  const baseClasses = {
    1: 'text-4xl md:text-5xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-bold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-semibold',
    6: 'text-base md:text-lg font-semibold',
  };

  return (
    <Tag id={id} className={`${baseClasses[level]} ${className}`}>
      {children}
    </Tag>
  );
}
