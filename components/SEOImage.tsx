import Image from 'next/image';

interface SEOImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * Composant Image optimisé pour le SEO
 * - Optimisation automatique des images
 * - Lazy loading
 * - WebP/AVIF support
 * - Responsive images
 */
export function SEOImage({
  src,
  alt,
  title,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  quality = 85,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw',
  onLoad,
}: SEOImageProps) {
  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        title={title || alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={onLoad}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23f0f0f0' width='800' height='600'/%3E%3C/svg%3E"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      {alt && <figcaption className="sr-only">{alt}</figcaption>}
    </figure>
  );
}
