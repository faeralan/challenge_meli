import React from 'react';
import { Truck } from 'lucide-react';
import { meliColors } from './ProductDetail.styles';

interface ShippingInfoProps {
  freeShipping: boolean;
}

export const ShippingInfo: React.FC<ShippingInfoProps> = ({ freeShipping }) => {
  if (!freeShipping) {
    return null;
  }

  return (
    <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e6e6e6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <Truck style={{ width: '16px', height: '16px', color: meliColors.green }} />
        <span style={{ fontSize: '14px', color: meliColors.green, fontWeight: '600' }}>
          Envío gratis a todo el país
        </span>
      </div>
      <div style={{ fontSize: '12px', color: meliColors.darkGray, paddingLeft: '24px' }}>
        Conocé los tiempos y las formas de envío.
      </div>
    </div>
  );
}; 