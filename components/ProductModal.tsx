'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/components/CartContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ShoppingCart, X } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-4">
        <div className="relative w-full h-64 bg-gray-100 rounded">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div>
          <p className="text-gray-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through ml-2">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>
        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={20} />
          Ajouter au panier
        </Button>
      </div>
    </Modal>
  );
};
