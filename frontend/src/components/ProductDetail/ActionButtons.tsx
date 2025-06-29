import React from 'react';
import {
  ActionButtons as StyledActionButtons,
  BuyNowButton,
  AddToCartButton
} from './ProductDetail.styles';

interface ActionButtonsProps {
  onBuyNow?: () => void;
  onAddToCart?: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onBuyNow,
  onAddToCart,
  disabled = false
}) => {
  return (
    <StyledActionButtons>
      <BuyNowButton 
        size="large" 
        fullWidth
        onClick={onBuyNow}
        disabled={disabled}
      >
        Comprar ahora
      </BuyNowButton>
      <AddToCartButton 
        variant="outline" 
        size="large" 
        fullWidth
        onClick={onAddToCart}
        disabled={disabled}
      >
        Agregar al carrito
      </AddToCartButton>
    </StyledActionButtons>
  );
}; 