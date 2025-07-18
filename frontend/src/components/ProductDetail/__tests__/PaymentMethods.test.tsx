import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaymentMethods } from '../PaymentMethods';
import { PaymentMethod } from '../../../types';

// Mock the utility functions
jest.mock('../../../utils/productUtils', () => ({
  categorizePaymentMethods: jest.fn(),
  getPaymentMethodStyle: jest.fn(),
  getPaymentMethodDisplayName: jest.fn(),
}));

const { categorizePaymentMethods, getPaymentMethodStyle, getPaymentMethodDisplayName } = require('../../../utils/productUtils');

describe('PaymentMethods Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    getPaymentMethodStyle.mockReturnValue({});
    getPaymentMethodDisplayName.mockImplementation((id: string, name: string) => name);
  });

  test('renders null when no payment methods provided', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards: [],
      cash: []
    });

    const { container } = render(<PaymentMethods paymentMethods={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders null when payment methods is null', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards: [],
      cash: []
    });

    const { container } = render(<PaymentMethods paymentMethods={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders null when payment methods is undefined', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards: [],
      cash: []
    });

    const { container } = render(<PaymentMethods paymentMethods={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders basic structure with Mercado Pago section', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards: [],
      cash: [],
      mercadopago: [{ id: 'mercadopago', name: 'Mercado Pago', icon: 'mp-icon' }]
    });

    const paymentMethods: PaymentMethod[] = [
      { id: 'mercadopago', name: 'Mercado Pago', icon: 'mp-icon' }
    ];

    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.getByText('Medios de pago')).toBeInTheDocument();
    expect(screen.getByText('Cuotas sin Tarjeta')).toBeInTheDocument();
    expect(screen.getByText('Conocé otros medios de pago')).toBeInTheDocument();
  });

  test('renders credit cards section when credit cards are available', () => {
    const creditCards: PaymentMethod[] = [
      { id: 'visa', name: 'Visa', icon: 'visa-icon' },
      { id: 'mastercard', name: 'Mastercard', icon: 'mc-icon' }
    ];

    categorizePaymentMethods.mockReturnValue({
      creditCards,
      debitCards: [],
      cash: [],
      mercadopago: []
    });

    getPaymentMethodDisplayName.mockImplementation((id: string) => {
      if (id === 'visa_credit') return 'VISA';
      if (id === 'mastercard_credit') return 'MC';
      return id;
    });

    const paymentMethods: PaymentMethod[] = creditCards;
    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.getByText('Tarjetas de crédito')).toBeInTheDocument();
  });

  test('renders debit cards section when debit cards are available', () => {
    const debitCards: PaymentMethod[] = [
      { id: 'visa_debit', name: 'Visa Débito', icon: 'visa-debit-icon' },
    ];

    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards,
      cash: [],
      mercadopago: []
    });

    getPaymentMethodDisplayName.mockImplementation((id: string, name: string) => name);

    const paymentMethods: PaymentMethod[] = debitCards;
    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.getByText('Tarjetas de débito')).toBeInTheDocument();
  });

  test('renders cash section when cash methods are available', () => {
    const cashMethods: PaymentMethod[] = [
      { id: 'pagofacil', name: 'Pago Fácil', icon: 'pf-icon' }
    ];

    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards: [],
      cash: cashMethods,
      mercadopago: []
    });

    getPaymentMethodDisplayName.mockImplementation((id: string, name: string) => name);

    const paymentMethods: PaymentMethod[] = cashMethods;
    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.getByRole('heading', { name: 'Efectivo' })).toBeInTheDocument();
  });

  test('renders all sections when all payment method types are available', () => {
    const creditCards: PaymentMethod[] = [{ id: 'visa', name: 'Visa', icon: 'visa-icon' }];
    const debitCards: PaymentMethod[] = [{ id: 'visa_debit', name: 'Visa Débito', icon: 'visa-debit-icon' }];
    const cashMethods: PaymentMethod[] = [{ id: 'efectivo', name: 'Efectivo', icon: 'cash-icon' }];
    const mercadoPagoMethods: PaymentMethod[] = [{ id: 'mercadopago', name: 'Mercadopago', icon: 'mp-icon' }];

    categorizePaymentMethods.mockReturnValue({
      creditCards,
      debitCards,
      cash: cashMethods, 
      mercadopago: mercadoPagoMethods
    });

    getPaymentMethodDisplayName.mockImplementation((id: string, name: string) => name);

    const paymentMethods: PaymentMethod[] = [...creditCards, ...debitCards, ...cashMethods];
    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.getByText('Tarjetas de crédito')).toBeInTheDocument();
    expect(screen.getByText('Tarjetas de débito')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Efectivo' })).toBeInTheDocument();
  });

  test('does not render credit cards section when no credit cards available', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards: [{ id: 'visa_debit', name: 'Visa Débito' }],
      cash: [],
      mercadopago: []
    });

    const paymentMethods: PaymentMethod[] = [{ id: 'visa_debit', name: 'Visa Débito', icon: 'visa-debit-icon' }];
    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.queryByText('Tarjetas de crédito')).not.toBeInTheDocument();
  });

  test('does not render debit cards section when no debit cards available', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [{ id: 'visa', name: 'Visa', icon: 'visa-icon' }],
      debitCards: [],
      cash: [],
      mercadopago: []
    });

    const paymentMethods: PaymentMethod[] = [{ id: 'visa', name: 'Visa', icon: 'visa-icon' }];
    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.queryByText('Debit cards')).not.toBeInTheDocument();
  });

  test('does not render cash section when no cash methods available', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [{ id: 'visa', name: 'Visa', icon: 'visa-icon' }],
      debitCards: [],
      cash: [],
      mercadopago: []
    });

    const paymentMethods: PaymentMethod[] = [{ id: 'visa', name: 'Visa', icon: 'visa-icon' }];
    render(<PaymentMethods paymentMethods={paymentMethods} />);
    
    expect(screen.queryByText('Efectivo')).not.toBeInTheDocument();
  });

  test('renders payment method link with correct attributes', () => {
    categorizePaymentMethods.mockReturnValue({
      creditCards: [],
      debitCards: [],
      cash: [],
      mercadopago: []
    });

    render(<PaymentMethods paymentMethods={[{ id: 'test', name: 'Test', icon: 'test-icon' }]} />);
    
    const link = screen.getByText('Conocé otros medios de pago');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '#');
  });
}); 