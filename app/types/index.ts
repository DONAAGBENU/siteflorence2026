export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  ingredients: string[];
  category: string;
  stock: number;
  isFavorite?: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: {
    darkMode: boolean;
    newsletter: boolean;
  };
}