import React from 'react';
import {
  PaymentMethodsCard,
  PaymentMethodsTitle,
  PaymentSection,
  PaymentSectionTitle,
  PaymentMethodsGrid,
  PaymentMethodIcon,
  PaymentMethodLink,
} from './ProductDetail.styles';
import { PaymentMethod } from '../../types';
import { categorizePaymentMethods } from '../../utils/productUtils';

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ paymentMethods }) => {
  if (!paymentMethods || paymentMethods.length === 0) {
    return null;
  }

  const { creditCards, debitCards, cash, mercadopago } = categorizePaymentMethods(paymentMethods);

  return (
    <PaymentMethodsCard>
      <PaymentMethodsTitle>Medios de pago</PaymentMethodsTitle>
      
      {mercadopago.length > 0 && (
        <PaymentSection>
          <PaymentSectionTitle>Cuotas sin Tarjeta</PaymentSectionTitle>
          <PaymentMethodsGrid>
              {mercadopago.map(method => (
                <PaymentMethodIcon key={method.id}>
                  <img src={method.icon} alt={method.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </PaymentMethodIcon>
              ))}
          </PaymentMethodsGrid>
        </PaymentSection>
      )}

      {creditCards.length > 0 && (
        <PaymentSection>
          <PaymentSectionTitle>Tarjetas de crédito</PaymentSectionTitle>
          <PaymentMethodsGrid>
            {creditCards.map(method => (
              <PaymentMethodIcon key={method.id}>
                <img src={method.icon} alt={method.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </PaymentMethodIcon>
            ))}
          </PaymentMethodsGrid>
        </PaymentSection>
      )}

      {debitCards.length > 0 && (
        <PaymentSection>
          <PaymentSectionTitle>Tarjetas de débito</PaymentSectionTitle>
          <PaymentMethodsGrid>
            {debitCards.map(method => (
              <PaymentMethodIcon key={method.id}>
                <img src={method.icon} alt={method.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </PaymentMethodIcon>
            ))}
          </PaymentMethodsGrid>
        </PaymentSection>
      )}

      {cash.length > 0 && (
        <PaymentSection>
          <PaymentSectionTitle>Efectivo</PaymentSectionTitle>
          <PaymentMethodsGrid>
            {cash.map(method => (
              <PaymentMethodIcon key={method.id}>
                <img src={method.icon} alt={method.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </PaymentMethodIcon>
            ))}
          </PaymentMethodsGrid>
        </PaymentSection>
      )}

      <PaymentMethodLink href="#">
        Conocé otros medios de pago
      </PaymentMethodLink>
    </PaymentMethodsCard>
  );
}; 