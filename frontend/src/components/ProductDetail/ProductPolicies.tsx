import React from 'react';
import { meliColors } from './ProductDetail.styles';

export const ProductPolicies: React.FC = () => {
  return (
    <div style={{ borderTop: '1px solid #e6e6e6', paddingTop: '16px', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '16px', color: meliColors.blue, marginTop: '2px' }}>↻</span>
        <div style={{ fontSize: '14px', color: meliColors.darkGray }}>
          <span style={{ color: meliColors.blue, fontWeight: '500' }}>
            Devolución gratis.
          </span>
          {' '}Tenés 30 días desde que lo recibís.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ fontSize: '16px', color: meliColors.blue, marginTop: '2px' }}>🛡</span>
        <div style={{ fontSize: '14px', color: meliColors.darkGray }}>
          <span style={{ color: meliColors.blue, fontWeight: '500' }}>
            Compra Protegida
          </span>
          , recibí el producto que esperabas o te devolvemos tu dinero.
        </div>
      </div>
    </div>
  );
}; 