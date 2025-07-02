import { useCallback } from 'react';
import { Product } from '../types';

interface UseProductActionsProps {
  product: Product | null;
  quantity: number;
}

interface UseProductActionsReturn {
  handleBuyNow: () => void;
  handleAddToCart: () => void;
}

export const useProductActions = ({ 
  product, 
  quantity 
}: UseProductActionsProps): UseProductActionsReturn => {
  
  const handleBuyNow = useCallback(() => {
    if (!product) {
      console.warn('No se puede comprar: producto no disponible');
      return;
    }

    console.log('Comprar ahora:', {
      productId: product.id,
      quantity,
      price: product.price * quantity
    });
    
    // Here we would implement the actual purchase logic
    // For example, redirect to checkout or open a purchase modal
  }, [product?.id, product?.price, quantity]);

  const handleAddToCart = useCallback(() => {
    if (!product) {
      console.warn('No se puede agregar al carrito: producto no disponible');
      return;
    }

    console.log('Agregar al carrito:', {
      productId: product.id,
      quantity,
      price: product.price
    });
    
    // Here we would implement the actual cart logic
    // For example, call an API or update global state
  }, [product?.id, product?.price, quantity]);

  return {
    handleBuyNow,
    handleAddToCart
  };
}; 