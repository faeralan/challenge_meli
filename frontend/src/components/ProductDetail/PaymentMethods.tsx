import React from 'react';
import {
  PaymentMethodsCard,
  PaymentMethodsTitle,
  PaymentSection,
  PaymentSectionTitle,
  PaymentSectionSubtitle,
  PaymentMethodsGrid,
  PaymentMethodIcon,
  MercadoPagoIcon,
  PaymentMethodLink,
} from './ProductDetail.styles';
import { 
  categorizePaymentMethods,
  getPaymentMethodStyle,
  getPaymentMethodDisplayName 
} from '../../utils/productUtils';
import { PaymentMethod } from '../../types';

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ paymentMethods }) => {
  if (!paymentMethods || paymentMethods.length === 0) {
    return null;
  }

  const { creditCards, debitCards, cash } = categorizePaymentMethods(paymentMethods);

  const renderPaymentIcon = (methodId: string, methodName: string): React.ReactElement => {
    const displayName = getPaymentMethodDisplayName(methodId, methodName);
    const style = getPaymentMethodStyle(methodId);
    
    return (
      <PaymentMethodIcon key={methodId} style={style}>
        {displayName}
      </PaymentMethodIcon>
    );
  };

  return (
    <PaymentMethodsCard>
      <PaymentMethodsTitle>Medios de pago</PaymentMethodsTitle>
      
      <PaymentSection>
        <PaymentSectionTitle>Cuotas sin Tarjeta</PaymentSectionTitle>
        <PaymentMethodsGrid>
          <MercadoPagoIcon>
            mercado<br/>pago
          </MercadoPagoIcon>
        </PaymentMethodsGrid>
      </PaymentSection>

      {creditCards.length > 0 && (
        <PaymentSection>
          <PaymentSectionTitle>Tarjetas de crédito</PaymentSectionTitle>
          <PaymentSectionSubtitle>¡Mismo precio en cuotas con bancos seleccionados!</PaymentSectionSubtitle>
          <PaymentMethodsGrid>
            {creditCards.map(method => renderPaymentIcon(method.id, method.name))}
          </PaymentMethodsGrid>
        </PaymentSection>
      )}

      {debitCards.length > 0 && (
        <PaymentSection>
          <PaymentSectionTitle>Tarjetas de débito</PaymentSectionTitle>
          <PaymentMethodsGrid>
            {debitCards.map(method => renderPaymentIcon(method.id, method.name))}
          </PaymentMethodsGrid>
        </PaymentSection>
      )}

      {cash.length > 0 && (
        <PaymentSection>
          <PaymentSectionTitle>Efectivo</PaymentSectionTitle>
          <PaymentMethodsGrid>
            {cash.map(method => renderPaymentIcon(method.id, method.name))}
          </PaymentMethodsGrid>
        </PaymentSection>
      )}

      <PaymentMethodLink href="#">
        Conocé otros medios de pago
      </PaymentMethodLink>
    </PaymentMethodsCard>
  );
}; 