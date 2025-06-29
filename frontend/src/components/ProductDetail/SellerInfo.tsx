import React from 'react';
import { SellerSection, SellerName } from './ProductDetail.styles';
import { meliColors } from './ProductDetail.styles';
import { SellerInfo as SellerInfoType } from '../../types';

interface SellerInfoProps {
  seller: SellerInfoType;
}

export const SellerInfo: React.FC<SellerInfoProps> = ({ seller }) => {
  return (
    <SellerSection>
      <div style={{ fontSize: '14px', color: meliColors.darkGray, marginBottom: '8px' }}>
        Vendido por <span style={{ color: meliColors.blue, fontWeight: '500' }}>{seller.name}</span>
      </div>
      
      <SellerName>
        <span style={{ color: meliColors.black, fontWeight: '700', fontSize: '12px' }}>
          +{seller.salesCount} ventas
        </span>
      </SellerName>
    </SellerSection>
  );
}; 