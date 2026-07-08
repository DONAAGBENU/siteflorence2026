'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

const translations = {
  fr: {
    // Navigation
    products: 'Élixirs',
    cart: 'Panier',
    login: 'Connexion',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    // Produits
    addToCart: 'Ajouter au panier',
    order: 'Commander',
    orderNow: 'Commander maintenant',
    price: 'Prix',
    stock: 'Stock',
    category: 'Catégorie',
    description: 'Description',
    ingredients: 'Ingrédients',
    // Panier
    yourCart: 'Votre panier',
    emptyCart: 'Votre panier est vide',
    total: 'Total',
    checkout: 'Passer commande',
    remove: 'Supprimer',
    quantity: 'Quantité',
    // Auth
    loginRequired: 'Connexion requise',
    loginToOrder: 'Connectez-vous pour commander',
    phone: 'Numéro de téléphone',
    password: 'Mot de passe',
    name: 'Nom complet',
    register: "S'inscrire",
    // Dashboard
    totalProducts: 'Produits',
    totalUsers: 'Utilisateurs',
    totalOrders: 'Commandes',
    revenue: 'Revenus',
    recentActivity: 'Activité récente',
    newProduct: 'Nouveau produit ajouté',
    newUser: 'Nouvel utilisateur',
    // Settings
    theme: 'Thème',
    darkTheme: 'Sombre',
    lightTheme: 'Clair',
    language: 'Langue',
    french: 'Français',
    english: 'English',
    saveSettings: 'Sauvegarder',
    // Orders
    pending: 'En attente',
    confirmed: 'Confirmée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    // General
    search: 'Rechercher',
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    loading: 'Chargement...',
    noData: 'Aucune donnée',
  },
  en: {
    // Navigation
    products: 'Elixirs',
    cart: 'Cart',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    settings: 'Settings',
    // Products
    addToCart: 'Add to cart',
    order: 'Order',
    orderNow: 'Order now',
    price: 'Price',
    stock: 'Stock',
    category: 'Category',
    description: 'Description',
    ingredients: 'Ingredients',
    // Cart
    yourCart: 'Your cart',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    checkout: 'Checkout',
    remove: 'Remove',
    quantity: 'Quantity',
    // Auth
    loginRequired: 'Login required',
    loginToOrder: 'Please login to place an order',
    phone: 'Phone number',
    password: 'Password',
    name: 'Full name',
    register: 'Register',
    // Dashboard
    totalProducts: 'Products',
    totalUsers: 'Users',
    totalOrders: 'Orders',
    revenue: 'Revenue',
    recentActivity: 'Recent activity',
    newProduct: 'New product added',
    newUser: 'New user',
    // Settings
    theme: 'Theme',
    darkTheme: 'Dark',
    lightTheme: 'Light',
    language: 'Language',
    french: 'Français',
    english: 'English',
    saveSettings: 'Save',
    // Orders
    pending: 'Pending',
    confirmed: 'Confirmed',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    // General
    search: 'Search',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    noData: 'No data',
  }
};

type TranslationKey = keyof typeof translations.fr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('fleur-language') as Language | null;
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fleur-language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
