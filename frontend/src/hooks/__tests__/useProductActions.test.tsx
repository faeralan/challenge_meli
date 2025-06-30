import { renderHook, act } from '@testing-library/react';
import { useProductActions } from '../useProductActions';
import { Product } from '../../types';

const mockProduct: Product = {
  id: 'MLA123',
  title: 'iPhone 14 Pro',
  slug: 'iphone-14-pro',
  description: 'Latest iPhone model',
  price: 999999,
  images: ['image1.jpg'],
  mainImage: 'main.jpg',
  stock: 10,
  condition: 'new' as const,
  category: 'Electronics',
  seller: {
    id: 'seller1',
    name: 'Tech Store',
    reputation: 4.8,
    location: 'Buenos Aires',
    salesCount: 150,
    joinDate: new Date('2020-01-01'),
    isVerified: true
  },
  rating: 4.5,
  totalReviews: 120,
  paymentMethods: [],
  freeShipping: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('useProductActions Hook', () => {
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  test('returns correct function types', () => {
    const { result } = renderHook(() => 
      useProductActions({ product: mockProduct, quantity: 1 })
    );
    
    expect(typeof result.current.handleBuyNow).toBe('function');
    expect(typeof result.current.handleAddToCart).toBe('function');
  });

  test('handleBuyNow logs correct information with valid product', () => {
    const { result } = renderHook(() => 
      useProductActions({ product: mockProduct, quantity: 2 })
    );
    
    act(() => {
      result.current.handleBuyNow();
    });
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Comprar ahora:', {
      productId: 'MLA123',
      quantity: 2,
      price: 1999998 // 999999 * 2
    });
  });

  test('handleAddToCart logs correct information with valid product', () => {
    const { result } = renderHook(() => 
      useProductActions({ product: mockProduct, quantity: 3 })
    );
    
    act(() => {
      result.current.handleAddToCart();
    });
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Agregar al carrito:', {
      productId: 'MLA123',
      quantity: 3,
      price: 999999
    });
  });

  test('handleBuyNow warns and returns early when product is null', () => {
    const { result } = renderHook(() => 
      useProductActions({ product: null, quantity: 1 })
    );
    
    act(() => {
      result.current.handleBuyNow();
    });
    
    expect(mockConsoleWarn).toHaveBeenCalledWith('No se puede comprar: producto no disponible');
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  test('handleAddToCart warns and returns early when product is null', () => {
    const { result } = renderHook(() => 
      useProductActions({ product: null, quantity: 1 })
    );
    
    act(() => {
      result.current.handleAddToCart();
    });
    
    expect(mockConsoleWarn).toHaveBeenCalledWith('No se puede agregar al carrito: producto no disponible');
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  test('handles different quantities correctly', () => {
    const { result: result1 } = renderHook(() => 
      useProductActions({ product: mockProduct, quantity: 1 })
    );
    
    const { result: result5 } = renderHook(() => 
      useProductActions({ product: mockProduct, quantity: 5 })
    );
    
    act(() => {
      result1.current.handleBuyNow();
    });
    
    act(() => {
      result5.current.handleBuyNow();
    });
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Comprar ahora:', {
      productId: 'MLA123',
      quantity: 1,
      price: 999999
    });
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Comprar ahora:', {
      productId: 'MLA123',
      quantity: 5,
      price: 4999995 // 999999 * 5
    });
  });

  test('functions use memoization correctly', () => {
    const { result, rerender } = renderHook((props) => 
      useProductActions(props),
      { 
        initialProps: { product: mockProduct, quantity: 1 }
      }
    );
    
    const initialHandleBuyNow = result.current.handleBuyNow;
    const initialHandleAddToCart = result.current.handleAddToCart;
    
    // Rerender with same props
    rerender({ product: mockProduct, quantity: 1 });
    
    // Functions should be the same (memoized)
    expect(result.current.handleBuyNow).toBe(initialHandleBuyNow);
    expect(result.current.handleAddToCart).toBe(initialHandleAddToCart);
  });

  test('functions update when dependencies change', () => {
    const { result, rerender } = renderHook((props) => 
      useProductActions(props),
      { 
        initialProps: { product: mockProduct, quantity: 1 }
      }
    );
    
    const initialHandleBuyNow = result.current.handleBuyNow;
    
    // Rerender with different quantity
    rerender({ product: mockProduct, quantity: 2 });
    
    // Function should be different (dependency changed)
    expect(result.current.handleBuyNow).not.toBe(initialHandleBuyNow);
  });

  test('handles product with different properties', () => {
    const expensiveProduct = {
      ...mockProduct,
      id: 'MLA999',
      price: 5000000
    };
    
    const { result } = renderHook(() => 
      useProductActions({ product: expensiveProduct, quantity: 1 })
    );
    
    act(() => {
      result.current.handleAddToCart();
    });
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Agregar al carrito:', {
      productId: 'MLA999',
      quantity: 1,
      price: 5000000
    });
  });
}); 