import { 
  formatPrice, 
  calculateOriginalPrice, 
  calculateInstallmentPrice,
  calculatePriceWithoutTaxes,
  calculateSalesCount,
  getConditionText,
  getDiscountPercentage,
  formatPluralUnits,
  categorizePaymentMethods,
  getPaymentMethodStyle,
  getPaymentMethodDisplayName
} from '../productUtils';

describe('Product Utils', () => {
  describe('formatPrice', () => {
    test('formats prices using Intl.NumberFormat', () => {
      expect(formatPrice(100)).toBe('$\u00A0100');
      expect(formatPrice(1000)).toBe('$\u00A01.000');
      expect(formatPrice(1234567)).toBe('$\u00A01.234.567');
    });

    test('handles zero correctly', () => {
      expect(formatPrice(0)).toBe('$\u00A00');
    });

    test('handles large numbers', () => {
      expect(formatPrice(999999999)).toBe('$\u00A0999.999.999');
    });
  });

  describe('calculateOriginalPrice', () => {
    test('calculates original price with default 25% discount', () => {
      expect(calculateOriginalPrice(800)).toBe(1000);
      expect(calculateOriginalPrice(1000)).toBe(1250);
    });

    test('calculates original price with custom discount', () => {
      expect(calculateOriginalPrice(900, 10)).toBe(990);
      expect(calculateOriginalPrice(500, 50)).toBe(750);
    });

    test('handles zero price', () => {
      expect(calculateOriginalPrice(0)).toBe(0);
    });
  });

  describe('calculateInstallmentPrice', () => {
    test('calculates installment price with default 12 installments', () => {
      expect(calculateInstallmentPrice(12000)).toBe(1000);
      expect(calculateInstallmentPrice(1200)).toBe(100);
    });

    test('calculates installment price with custom installments', () => {
      expect(calculateInstallmentPrice(1000, 6)).toBe(167);
      expect(calculateInstallmentPrice(999, 3)).toBe(333);
    });

    test('handles zero price', () => {
      expect(calculateInstallmentPrice(0)).toBe(0);
    });

    test('handles single installment', () => {
      expect(calculateInstallmentPrice(500, 1)).toBe(500);
    });
  });

  describe('calculatePriceWithoutTaxes', () => {
    test('calculates price without default 21% taxes', () => {
      expect(calculatePriceWithoutTaxes(1000)).toBe(790);
      expect(calculatePriceWithoutTaxes(500)).toBe(395);
    });

    test('calculates price without custom tax percentage', () => {
      expect(calculatePriceWithoutTaxes(1000, 10)).toBe(900);
      expect(calculatePriceWithoutTaxes(200, 5)).toBe(190);
    });

    test('handles zero price', () => {
      expect(calculatePriceWithoutTaxes(0)).toBe(0);
    });
  });

  describe('calculateSalesCount', () => {
    test('calculates sales count with default multiplier 5', () => {
      expect(calculateSalesCount(100)).toBe(500);
      expect(calculateSalesCount(20)).toBe(100);
    });

    test('calculates sales count with custom multiplier', () => {
      expect(calculateSalesCount(50, 2)).toBe(100);
      expect(calculateSalesCount(10, 10)).toBe(100);
    });

    test('handles zero reviews', () => {
      expect(calculateSalesCount(0)).toBe(0);
    });

    test('uses floor for fractional results', () => {
      expect(calculateSalesCount(3, 2)).toBe(6);
      expect(calculateSalesCount(1, 3)).toBe(3);
    });
  });

  describe('getConditionText', () => {
    test('returns Nuevo for new condition', () => {
      expect(getConditionText('new')).toBe('Nuevo');
    });

    test('returns Usado for any other condition', () => {
      expect(getConditionText('used')).toBe('Usado');
      expect(getConditionText('refurbished')).toBe('Usado');
      expect(getConditionText('anything')).toBe('Usado');
    });
  });

  describe('getDiscountPercentage', () => {
    test('calculates discount percentage correctly', () => {
      expect(getDiscountPercentage(1000, 800)).toBe(20);
      expect(getDiscountPercentage(500, 250)).toBe(50);
    });

    test('handles no discount', () => {
      expect(getDiscountPercentage(1000, 1000)).toBe(0);
    });

    test('handles increased price as negative discount', () => {
      expect(getDiscountPercentage(100, 150)).toBe(-50);
    });

    test('handles zero original price', () => {
      expect(getDiscountPercentage(0, 100)).toBe(NaN);
    });
  });

  describe('formatPluralUnits', () => {
    test('returns singular for quantity 1', () => {
      expect(formatPluralUnits(1)).toBe('unidad');
      expect(formatPluralUnits(1, 'item', 'items')).toBe('item');
    });

    test('returns plural for quantity > 1', () => {
      expect(formatPluralUnits(2)).toBe('unidades');
      expect(formatPluralUnits(5, 'item', 'items')).toBe('items');
    });

    test('returns plural for quantity 0', () => {
      expect(formatPluralUnits(0)).toBe('unidades');
    });
  });

  describe('categorizePaymentMethods', () => {
    const mockPaymentMethods = [
      { id: 'visa', name: 'VISA' },
      { id: 'mastercard', name: 'Mastercard' },
      { id: 'visa_debit', name: 'VISA Débito' },
      { id: 'pagofacil', name: 'Pago Fácil' },
      { id: 'rapipago', name: 'RapiPago' },
      { id: 'unknown', name: 'Unknown Method' }
    ];

    test('categorizes payment methods correctly', () => {
      const result = categorizePaymentMethods(mockPaymentMethods);
      
      expect(result.creditCards).toHaveLength(2);
      expect(result.creditCards[0].id).toBe('visa');
      expect(result.creditCards[1].id).toBe('mastercard');
      
      expect(result.debitCards).toHaveLength(1);
      expect(result.debitCards[0].id).toBe('visa_debit');
      
      expect(result.cash).toHaveLength(2);
      expect(result.cash[0].id).toBe('pagofacil');
      expect(result.cash[1].id).toBe('rapipago');
    });

    test('handles empty array', () => {
      const result = categorizePaymentMethods([]);
      
      expect(result.creditCards).toHaveLength(0);
      expect(result.debitCards).toHaveLength(0);
      expect(result.cash).toHaveLength(0);
    });
  });

  describe('getPaymentMethodStyle', () => {
    test('returns correct styles for known methods', () => {
      expect(getPaymentMethodStyle('naranja')).toEqual({
        background: '#ff6600',
        color: 'white'
      });
      
      expect(getPaymentMethodStyle('cabal')).toEqual({
        background: '#0066cc',
        color: 'white'
      });
      
      expect(getPaymentMethodStyle('pagofacil')).toEqual({
        background: '#ff0000',
        color: 'white'
      });
    });

    test('returns empty object for unknown methods', () => {
      expect(getPaymentMethodStyle('unknown')).toEqual({});
      expect(getPaymentMethodStyle('visa')).toEqual({});
    });

    test('handles case insensitive input', () => {
      expect(getPaymentMethodStyle('NARANJA')).toEqual({
        background: '#ff6600',
        color: 'white'
      });
    });
  });

  describe('getPaymentMethodDisplayName', () => {
    test('returns correct display names for known methods', () => {
      expect(getPaymentMethodDisplayName('visa', 'Visa')).toBe('VISA');
      expect(getPaymentMethodDisplayName('mastercard', 'Mastercard')).toBe('Mastercard');
      expect(getPaymentMethodDisplayName('naranja', 'Naranja')).toBe('Naranja X');
      expect(getPaymentMethodDisplayName('pagofacil', 'PagoFacil')).toBe('Pago Fácil');
    });

    test('returns original name for unknown methods', () => {
      expect(getPaymentMethodDisplayName('unknown', 'Custom Method')).toBe('Custom Method');
      expect(getPaymentMethodDisplayName('test', 'Test Payment')).toBe('Test Payment');
    });

    test('handles case insensitive input', () => {
      expect(getPaymentMethodDisplayName('VISA', 'Visa')).toBe('VISA');
      expect(getPaymentMethodDisplayName('Mastercard', 'MC')).toBe('Mastercard');
    });
  });
}); 