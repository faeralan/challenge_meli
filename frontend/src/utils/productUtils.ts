import { Product } from '../types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
};

export const calculateOriginalPrice = (price: number, discountPercentage: number = 25): number => {
  return Math.round(price * (1 + discountPercentage / 100));
};

export const calculateInstallmentPrice = (price: number, installments: number = 12): number => {
  return Math.round(price / installments);
};

export const calculatePriceWithoutTaxes = (price: number, taxPercentage: number = 21): number => {
  return Math.round(price * (1 - taxPercentage / 100));
};

export const calculateSalesCount = (totalReviews: number, multiplier: number = 5): number => {
  return Math.floor(totalReviews * multiplier);
};

export const getConditionText = (condition: string): string => {
  return condition === 'new' ? 'Nuevo' : 'Usado';
};

export const getDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatPluralUnits = (quantity: number, singular: string = 'unidad', plural: string = 'unidades'): string => {
  return quantity === 1 ? singular : plural;
};

export const categorizePaymentMethods = (paymentMethods: any[]) => {
  const creditCards = paymentMethods.filter(method => 
    ['visa', 'mastercard', 'american_express', 'naranja'].includes(method.id.toLowerCase())
  );
  
  const debitCards = paymentMethods.filter(method => 
    ['visa_debit', 'maestro', 'cabal', 'mastercard_debit'].includes(method.id.toLowerCase())
  );
  
  const cash = paymentMethods.filter(method => 
    ['pagofacil', 'rapipago', 'efectivo'].includes(method.id.toLowerCase())
  );

  return { creditCards, debitCards, cash };
};

export const getPaymentMethodStyle = (methodId: string) => {
  const id = methodId.toLowerCase();
  
  const styles: Record<string, React.CSSProperties> = {
    naranja: { background: '#ff6600', color: 'white' },
    cabal: { background: '#0066cc', color: 'white' },
    pagofacil: { background: '#ff0000', color: 'white' },
    rapipago: { background: '#000', color: 'white' },
  };

  return styles[id] || {};
};

export const getPaymentMethodDisplayName = (methodId: string, methodName: string): string => {
  const id = methodId.toLowerCase();
  
  const displayNames: Record<string, string> = {
    visa: 'VISA',
    mastercard: 'Mastercard',
    american_express: 'AMEX',
    naranja: 'Naranja X',
    visa_debit: 'VISA DÉBITO',
    maestro: 'maestro',
    cabal: 'CABAL DÉBITO',
    mastercard_debit: 'Mastercard DÉBITO',
    pagofacil: 'Pago Fácil',
    rapipago: 'rapipago',
  };

  return displayNames[id] || methodName;
}; 