export const siteConfig = {
  name: 'Fleur Sucrée',
  description: 'Élixirs naturels premium pour éveiller vos sens',
  url: 'https://siteflorence2026.com',
  domain: 'siteflorence2026.com',
  ogImage: '/og-image.jpg',
  twitter: '@fleursucree',
  email: 'contact@siteflorence2026.com',
  locale: 'fr-FR',
};

export const metadata = {
  home: {
    title: 'Accueil - Fleur Sucrée | Élixirs Naturels Premium',
    description: 'Bienvenue chez Fleur Sucrée. Découvrez notre collection exclusive d\'élixirs naturels premium pour éveiller vos sens et transformer votre bien-être.',
    keywords: ['élixirs naturels', 'produits artisanaux', 'Florence', 'parfums premium'],
    ogImage: '/og-home.jpg',
  },
  products: {
    title: 'Nos Produits - Fleur Sucrée | Élixirs Naturels',
    description: 'Découvrez notre gamme complète d\'élixirs naturels premium. Chaque produit est sélectionné pour sa qualité exceptionnelle et ses vertus naturelles.',
    keywords: ['acheter élixirs', 'produits naturels', 'parfums artisanaux', 'wellbeing'],
    ogImage: '/og-products.jpg',
  },
  dashboard: {
    title: 'Tableau de Bord - Fleur Sucrée',
    description: 'Accédez à votre tableau de bord pour gérer vos commandes et vos préférences.',
  },
  login: {
    title: 'Connexion - Fleur Sucrée',
    description: 'Connectez-vous à votre compte Fleur Sucrée pour accéder à vos commandes et données personnelles.',
  },
  register: {
    title: 'Inscription - Fleur Sucrée',
    description: 'Créez un compte Fleur Sucrée pour profiter de nos services et accéder à nos offres exclusives.',
  },
};

// JSON-LD Schema pour Organisation
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fleur Sucrée',
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.jpg`,
  description: siteConfig.description,
  sameAs: [
    'https://www.facebook.com/fleursucree',
    'https://www.instagram.com/fleursucree',
    'https://www.twitter.com/fleursucree',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: siteConfig.email,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Florence',
    addressCountry: 'IT',
  },
};

// JSON-LD Schema pour Product
export const productSchema = (product: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  brand: {
    '@type': 'Brand',
    name: 'Fleur Sucrée',
  },
  offers: {
    '@type': 'Offer',
    url: `${siteConfig.url}/products/${product.id}`,
    priceCurrency: 'XOF',
    price: product.price,
    availability: 'https://schema.org/InStock',
  },
  ...(product.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }),
});

// JSON-LD Schema pour Breadcrumb
export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
