import { PaymentMethod } from '../interfaces/payment-method.interface';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    icon: '/icons/mercadopago.svg',
    maxInstallments: 12,
    description: 'Paga con tu cuenta de MercadoPago'
  },
  {
    id: 'credit_card',
    name: 'Tarjeta de crédito',
    icon: '/icons/credit-card.svg',
    maxInstallments: 6,
    description: 'Visa, Mastercard, American Express'
  },
  {
    id: 'debit_card',
    name: 'Tarjeta de débito',
    icon: '/icons/debit-card.svg',
    maxInstallments: 1,
    description: 'Pago inmediato desde tu cuenta'
  },
  {
    id: 'bank_transfer',
    name: 'Transferencia bancaria',
    icon: '/icons/bank-transfer.svg',
    maxInstallments: 1,
    description: 'Transferí desde tu homebanking'
  },
  {
    id: 'cash',
    name: 'Efectivo',
    icon: '/icons/cash.svg',
    maxInstallments: 1,
    description: 'Pagá en efectivo al retirar'
  }
]; 