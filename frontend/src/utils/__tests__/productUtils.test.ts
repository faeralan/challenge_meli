import {
  formatPrice,
  getConditionText,
  categorizePaymentMethods,
} from '../productUtils';

describe('formatPrice', () => {
  it('should format numbers with correct currency and thousands separator', () => {
    expect(formatPrice(100)).toBe('$\u00A0100');
    expect(formatPrice(1000)).toBe('$\u00A01.000');
    expect(formatPrice(1234567)).toBe('$\u00A01.234.567');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('$\u00A00');
  });

  it('should handle large numbers', () => {
    expect(formatPrice(999999999)).toBe('$\u00A0999.999.999');
  });
});

describe('getConditionText', () => {
  it('should return "Nuevo" for new condition', () => {
    expect(getConditionText('new')).toBe('Nuevo');
  });

  it('should return "Usado" for any other condition', () => {
    expect(getConditionText('used')).toBe('Usado');
  });
});

describe('categorizePaymentMethods', () => {
  it('should correctly categorize payment methods', () => {
    const mockPaymentMethods = [
      { id: 'visa_credit', name: 'Visa Credit' },
      { id: 'mastercard_credit', name: 'Mastercard Credit' },
      { id: 'visa_debit', name: 'Visa Debit' },
      { id: 'mastercard_debit', name: 'Mastercard Debit' },
      { id: 'pagofacil', name: 'Pago Fácil' },
      { id: 'mercadopago', name: 'Mercado Pago' },
    ];

    const result = categorizePaymentMethods(mockPaymentMethods);

    expect(result.creditCards).toHaveLength(2);
    expect(result.debitCards).toHaveLength(2);
    expect(result.cash).toHaveLength(1);
    expect(result.mercadopago).toHaveLength(1);
  });

  it('should handle empty array', () => {
    const result = categorizePaymentMethods([]);
    expect(result.creditCards).toHaveLength(0);
    expect(result.debitCards).toHaveLength(0);
    expect(result.cash).toHaveLength(0);
    expect(result.mercadopago).toHaveLength(0);
  });
}); 