import { PaymentMethod } from '../interfaces/payment-method.interface';

// Valid payment method IDs that can be used in product creation/updates
export const VALID_PAYMENT_METHOD_IDS = [
  'mercadopago',
  'visa_credit', 
  'visa_debit',
  'mastercard_credit',
  'mastercard_debit',
  'pagofacil'
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    icon: 'http://localhost:3000/uploads/icons/mercadopago.svg',
    maxInstallments: 12,
    description: 'Paga con tu cuenta de MercadoPago'
  },
  {
    id: 'visa_credit',
    name: 'Tarjeta de crédito Visa',
    icon: 'http://localhost:3000/uploads/icons/visa_credit.svg',
    maxInstallments: 6,
    description: 'Visa'
  },
  {
    id: 'visa_debit',
    name: 'Tarjeta de débito Visa',
    icon: 'http://localhost:3000/uploads/icons/visa_debit.svg',
    maxInstallments: 1,
    description: 'Pago inmediato desde tu cuenta'
  },
  {
    id: 'mastercard_credit',
    name: 'Tarjeta de crédito Mastercard',
    icon: 'http://localhost:3000/uploads/icons/master_credit.svg',
    maxInstallments: 6,
    description: 'mastercard'
  },
  {
    id: 'mastercard_debit',
    name: 'Tarjeta de débito mastercard',
    icon: 'http://localhost:3000/uploads/icons/master_debit.svg',
    maxInstallments: 1,
    description: 'Pago inmediato desde tu cuenta'
  },
  {
    id: 'pagofacil',
    name: 'Pago Facil',
    icon: 'http://localhost:3000/uploads/icons/pagofacil.svg',
    maxInstallments: 1,
    description: 'Pagá en efectivo al retirar'
  }
]; 