import Link from 'next/link';
import { ReactNode } from 'react';

interface SEOLinkProps {
  href: string;
  children: ReactNode;
  title?: string;
  className?: string;
  rel?: string;
  external?: boolean;
  prefetch?: boolean;
  scroll?: boolean;
}

/**
 * Composant Link optimisé pour le SEO
 * - Utilise Next.js Link pour la préfétération
 * - Support des liens externes avec rel appropriés
 * - Accessibilité améliorée
 */
export function SEOLink({
  href,
  children,
  title,
  className = '',
  rel,
  external = false,
  prefetch = true,
  scroll = true,
}: SEOLinkProps) {
  const isExternal = external || href.startsWith('http');
  
  if (isExternal) {
    return (
      <a
        href={href}
        title={title}
        className={className}
        rel={`${rel || ''} noopener noreferrer`.trim()}
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      title={title}
      className={className}
      prefetch={prefetch}
      scroll={scroll}
      rel={rel}
    >
      {children}
    </Link>
  );
}
