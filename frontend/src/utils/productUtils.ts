export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
};

export const getConditionText = (condition: string): string => {
  return condition === 'new' ? 'Nuevo' : 'Usado';
};

export const categorizePaymentMethods = (paymentMethods: any[]) => {
  const creditCards = paymentMethods.filter(method => 
    ['visa_credit', 'mastercard_credit'].includes(method.id.toLowerCase())
  );
  
  const debitCards = paymentMethods.filter(method => 
    ['visa_debit', 'mastercard_debit'].includes(method.id.toLowerCase())
  );
  
  const cash = paymentMethods.filter(method => 
    ['pagofacil'].includes(method.id.toLowerCase())
  );

  const mercadopago = paymentMethods.filter(method => 
    ['mercadopago'].includes(method.id.toLowerCase())
  );

  return { creditCards, debitCards, cash, mercadopago };
};

export const calculateInstallmentPrice = (price: number, installments: number = 12): number => {
  return Math.round(price / installments);
};

export const calculateSalesCount = (): number => {
  return Math.floor(Math.random() * 1000) + 1;
}; 

export const formatPluralUnits = (quantity: number, singular: string = 'unidad', plural: string = 'unidades'): string => {
  return quantity === 1 ? singular : plural;
};

export const getPaymentMethodDisplayName = (methodId: string, methodName: string): string => {
  const id = methodId.toLowerCase();
  
  const displayNames: Record<string, string> = {
    visa_credit: 'VISA',
    mastercard_credit: 'Mastercard',
    visa_debit: 'VISA DÉBITO',
    mastercard_debit: 'Mastercard DÉBITO',
    pagofacil: 'Pago Fácil', 
    mercadopago: 'Mercado Pago',
  };

  return displayNames[id] || methodName;
}; 