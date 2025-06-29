import React from 'react';
import {
  QuantitySection,
  QuantityLabel,
  QuantityDropdown,
  QuantityButton,
  DropdownArrow,
  QuantityOptions,
  QuantityOption,
  StockInfo
} from './ProductDetail.styles';
import { formatPluralUnits } from '../../utils/productUtils';

interface QuantitySelectorProps {
  stock: number;
  quantity: number;
  isQuantityDropdownOpen: boolean;
  getQuantityOptions: (stock: number) => number[];
  toggleQuantityDropdown: (e?: React.MouseEvent) => void;
  selectQuantity: (newQuantity: number, e?: React.MouseEvent) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  stock,
  quantity,
  isQuantityDropdownOpen,
  getQuantityOptions,
  toggleQuantityDropdown,
  selectQuantity
}) => {
  if (stock === 1) {
    return (
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#000', margin: '0 0 16px 0' }}>
        ¡Último disponible!
      </h3>
    );
  }

  return (
    <QuantitySection>
      <QuantityLabel>
        Cantidad: <QuantityDropdown data-open={isQuantityDropdownOpen} data-dropdown="quantity">
          <QuantityButton onClick={(e) => toggleQuantityDropdown(e)}>
            {quantity} {formatPluralUnits(quantity)}
            <DropdownArrow>⌄</DropdownArrow>
          </QuantityButton>
          <QuantityOptions isOpen={isQuantityDropdownOpen}>
            {getQuantityOptions(stock).map((option) => (
              <QuantityOption
                key={option}
                onClick={(e) => selectQuantity(option, e)}
              >
                {option} {formatPluralUnits(option)}
              </QuantityOption>
            ))}
          </QuantityOptions>
        </QuantityDropdown> <StockInfo>({stock} disponibles)</StockInfo>
      </QuantityLabel>
    </QuantitySection>
  );
}; 