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

    // Lógica para comprar ahora
    console.log('Comprar ahora:', {
      productId: product.id,
      quantity,
      price: product.price * quantity
    });
    
    // Aquí se implementaría la lógica real de compra
    // Por ejemplo, redirigir al checkout o abrir modal de compra
  }, [product?.id, product?.price, quantity]);

  const handleAddToCart = useCallback(() => {
    if (!product) {
      console.warn('No se puede agregar al carrito: producto no disponible');
      return;
    }

    // Lógica para agregar al carrito
    console.log('Agregar al carrito:', {
      productId: product.id,
      quantity,
      price: product.price
    });
    
    // Aquí se implementaría la lógica real de carrito
    // Por ejemplo, llamar a una API o actualizar estado global
  }, [product?.id, product?.price, quantity]);

  return {
    handleBuyNow,
    handleAddToCart
  };
}; 