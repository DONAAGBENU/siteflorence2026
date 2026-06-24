import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Élixir Éternité',
    description: 'Synergie parfaite de 12 plantes rares pour une passion durable',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ingredients: ['Safran Iranien', 'Maca Noire', 'Tribulus Terrestris', 'Ashwagandha', 'Ginseng Rouge'],
    category: 'premium',
    stock: 50,
    isFavorite: false
  },
  {
    id: 2,
    name: 'Nectar Divin',
    description: 'Élixir d\'ambroisie aux notes de vanille de Madagascar',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ingredients: ['Vanille Bourbon', 'Fleur d\'Oranger', 'Cardamome Verte', 'Miel de Manuka'],
    category: 'signature',
    stock: 30,
    isFavorite: false
  },
  {
    id: 3,
    name: 'Chocolat Extase',
    description: 'Chocolat noir 90% infusé aux super-aliments aphrodisiaques',
    price: 49.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1570913199992-91d07c140e7a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    ingredients: ['Cacao Pur', 'Guarana', 'Maca', 'Spiruline', 'Fruits Rouges Lyophilisés'],
    category: 'gourmet',
    stock: 100,
    isFavorite: false
  },
  {
    id: 4,
    name: 'Huile Sacrée',
    description: 'Huile de massage aux phéromones et cristaux énergétiques',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    ingredients: ['Huile d\'Argan', 'Rose de Damas', 'Ylang-Ylang', 'Cristal Chargé'],
    category: 'luxe',
    stock: 25,
    isFavorite: false
  }
];

export const categories = [
  { id: 'all', name: 'Tous les produits' },
  { id: 'premium', name: 'Premium' },
  { id: 'signature', name: 'Signature' },
  { id: 'gourmet', name: 'Gourmet' },
  { id: 'luxe', name: 'Luxe' }
];