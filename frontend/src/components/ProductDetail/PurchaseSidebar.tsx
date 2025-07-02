import React from 'react';
import {
  PurchaseSidebar as StyledPurchaseSidebar,
  PurchaseBox
} from './ProductDetail.styles';
import { ShippingInfo } from './ShippingInfo';
import { QuantitySelector } from './QuantitySelector';
import { ActionButtons } from './ActionButtons';
import { SellerInfo } from './SellerInfo';
import { ProductPolicies } from './ProductPolicies';
import { PaymentMethods } from './PaymentMethods';
import { Product } from '../../types';

interface PurchaseSidebarProps {
  product: Product;
  quantity: number;
  isQuantityDropdownOpen: boolean;
  getQuantityOptions: (stock: number) => number[];
  toggleQuantityDropdown: (e?: React.MouseEvent) => void;
  selectQuantity: (newQuantity: number, e?: React.MouseEvent) => void;
  onBuyNow?: () => void;
  onAddToCart?: () => void;
}

export const PurchaseSidebar: React.FC<PurchaseSidebarProps> = ({
  product,
  quantity,
  isQuantityDropdownOpen,
  getQuantityOptions,
  toggleQuantityDropdown,
  selectQuantity,
  onBuyNow,
  onAddToCart
}) => {
  return (
    <StyledPurchaseSidebar>
      <PurchaseBox>
        <ShippingInfo freeShipping={product.freeShipping} />
        
        <div style={{ marginBottom: '20px' }}>
          {product.stock > 1 && (
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#000', margin: '0 0 16px 0' }}>
              Stock disponible
            </h3>
          )}
          
          <QuantitySelector
            stock={product.stock}
            quantity={quantity}
            isQuantityDropdownOpen={isQuantityDropdownOpen}
            getQuantityOptions={getQuantityOptions}
            toggleQuantityDropdown={toggleQuantityDropdown}
            selectQuantity={selectQuantity}
          />

          <ActionButtons
            onBuyNow={onBuyNow}
            onAddToCart={onAddToCart}
            disabled={product.stock === 0}
          />
        </div>

        <SellerInfo seller={product.seller} />
        
        <ProductPolicies warranty={product.warranty} />
      </PurchaseBox>

      <PaymentMethods paymentMethods={product.paymentMethods} />
    </StyledPurchaseSidebar>
  );
}; 