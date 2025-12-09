import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Rose Luxe',
    description: 'Magnifique bouquet de roses rouges premium',
    price: 49.99,
    originalPrice: 65.00,
    image: 'https://images.unsplash.com/photo-1519895917318-1d883383e042?w=400&h=400&fit=crop',
    rating: 4.8,
    ingredients: ['Rose rouge', 'Feuillage vert', 'Ruban de soie'],
    category: 'Bouquets',
    stock: 10,
    isFavorite: false
  },
  {
    id: 2,
    name: 'Tulipes Printemps',
    description: 'Joyeuses tulipes multicolores',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=400&h=400&fit=crop',
    rating: 4.6,
    ingredients: ['Tulipes', 'Muguet', 'Feuillage'],
    category: 'Bouquets',
    stock: 15,
    isFavorite: false
  },
  {
    id: 3,
    name: 'Orchidée Blanche',
    description: 'Élégante orchidée blanche en pot',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1563241527-3004b92f0c84?w=400&h=400&fit=crop',
    rating: 4.9,
    ingredients: ['Orchidée', 'Substrat premium', 'Pot céramique'],
    category: 'Plantes',
    stock: 8,
    isFavorite: false
  },
  {
    id: 4,
    name: 'Marguerites Joyeuses',
    description: 'Bouquet coloré de marguerites fraîches',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1585865399101-3ac23a199d7e?w=400&h=400&fit=crop',
    rating: 4.5,
    ingredients: ['Marguerites', 'Muguet', 'Feuillage'],
    category: 'Bouquets',
    stock: 20,
    isFavorite: false
  }
];
