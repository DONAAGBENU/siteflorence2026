'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { Heart, Star, CheckCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // Ici, vous pourriez sauvegarder la préférence dans une base de données
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-6">
        {/* Image */}
        <div className="relative h-64 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm"
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-rose-600 text-rose-600' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Prix et rating */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.price.toFixed(2)}€
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through ml-2">
                  {product.originalPrice.toFixed(2)}€
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-bold">{product.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300">{product.description}</p>

        {/* Ingrédients */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-3">Ingrédients :</h4>
          <div className="space-y-2">
            {product.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sélecteur de quantité */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantité
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Sous-total</p>
            <p className="text-2xl font-bold text-rose-600">
              {(product.price * quantity).toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Continuer mes achats
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1"
          >
            Ajouter au panier ({quantity})
          </Button>
        </div>
      </div>
    </Modal>
  );
};