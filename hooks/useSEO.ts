import { useEffect } from 'react';

/**
 * Hook pour ajouter du contenu au head dynamiquement
 * Utile pour les mises à jour client-side du SEO
 */
export function useSEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
} = {}) {
  useEffect(() => {
    if (title) {
      document.title = title;
      const titleTag = document.querySelector('meta[property="og:title"]');
      if (titleTag) titleTag.setAttribute('content', title);
    }

    if (description) {
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute('content', description);
      
      const ogDescTag = document.querySelector('meta[property="og:description"]');
      if (ogDescTag) ogDescTag.setAttribute('content', description);
    }

    if (keywords) {
      const keywordTag = document.querySelector('meta[name="keywords"]');
      if (keywordTag) keywordTag.setAttribute('content', keywords.join(', '));
    }

    if (ogImage) {
      const ogImageTag = document.querySelector('meta[property="og:image"]');
      if (ogImageTag) ogImageTag.setAttribute('content', ogImage);
    }

    if (ogType) {
      const ogTypeTag = document.querySelector('meta[property="og:type"]');
      if (ogTypeTag) ogTypeTag.setAttribute('content', ogType);
    }
  }, [title, description, keywords, ogImage, ogType]);
}

/**
 * Hook pour ajouter du JSON-LD dynamiquement
 */
export function useJsonLD(schema: object) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);
}

/**
 * Hook pour tracker les Core Web Vitals
 */
export function useWebVitals() {
  useEffect(() => {
    const reportWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
          'web-vitals'
        );

        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      } catch (e) {
        // package not installed or failed to load; ignore
        console.warn('web-vitals unavailable', e);
      }
    };

    reportWebVitals();
  }, []);
}
