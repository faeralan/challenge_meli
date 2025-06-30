import { renderHook, waitFor, act } from '@testing-library/react';
import { useProductDetail, useImageGallery, useQuantityDropdown } from '../useProductDetail';

// Mock the API service default export
jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    getProduct: jest.fn(),
  },
  apiService: {
    getProduct: jest.fn(),
  },
}));

import apiService from '../../services/api';

// Cast to get the mocked version
const mockGetProduct = apiService.getProduct as jest.MockedFunction<typeof apiService.getProduct>;

describe('useProductDetail Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state when no ID provided', () => {
    const { result } = renderHook(() => useProductDetail(undefined));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test('initial state when empty ID provided', () => {
    const { result } = renderHook(() => useProductDetail(''));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test('calls API with correct product ID', async () => {
    const mockProduct = {
      id: 'MLA123',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      price: 100,
      images: ['test.jpg'],
      mainImage: 'test.jpg',
      stock: 10,
      condition: 'new' as const,
      category: 'Test',
      seller: {
        id: 'seller1',
        name: 'Test Seller',
        reputation: 5,
        location: 'Test Location',
        salesCount: 10,
        joinDate: new Date(),
        isVerified: true
      },
      rating: 5,
      totalReviews: 10,
      paymentMethods: [],
      freeShipping: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockGetProduct.mockResolvedValue(mockProduct);
    
    renderHook(() => useProductDetail('MLA123'));
    
    await waitFor(() => {
      expect(mockGetProduct).toHaveBeenCalledWith('MLA123');
    });
  });

  test('handles API success', async () => {
    const mockProduct = {
      id: 'MLA123',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      price: 100,
      images: ['test.jpg'],
      mainImage: 'test.jpg',
      stock: 10,
      condition: 'new' as const,
      category: 'Test',
      seller: {
        id: 'seller1',
        name: 'Test Seller',
        reputation: 5,
        location: 'Test Location',
        salesCount: 10,
        joinDate: new Date(),
        isVerified: true
      },
      rating: 5,
      totalReviews: 10,
      paymentMethods: [],
      freeShipping: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockGetProduct.mockResolvedValue(mockProduct);
    
    const { result } = renderHook(() => useProductDetail('MLA123'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.product).toEqual(mockProduct);
      expect(result.current.error).toBeNull();
    });
  });

  test('handles API error', async () => {
    mockGetProduct.mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => useProductDetail('MLA123'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.product).toBeNull();
      expect(result.current.error).toBe('Error al cargar el producto');
    });
  });

  test('handles API error with response message', async () => {
    const apiError = {
      response: {
        data: {
          message: 'Product not found'
        }
      }
    };
    mockGetProduct.mockRejectedValue(apiError);
    
    const { result } = renderHook(() => useProductDetail('MLA123'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.product).toBeNull();
      expect(result.current.error).toBe('Product not found');
    });
  });
});

describe('useImageGallery Hook', () => {
  // Mock Image constructor
  const mockImage = {
    complete: false,
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null,
    src: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Image constructor
    (global as any).Image = jest.fn(() => mockImage);
  });

  test('initial state with empty images', () => {
    const { result } = renderHook(() => useImageGallery([]));
    
    expect(result.current.selectedImageIndex).toBe(0);
    expect(result.current.imageLoading).toBe(true);
    expect(result.current.imageError).toBe(false);
  });

  test('initial state with images array', () => {
    const images = ['image1.jpg', 'image2.jpg'];
    const { result } = renderHook(() => useImageGallery(images));
    
    expect(result.current.selectedImageIndex).toBe(0);
    expect(result.current.imageLoading).toBe(true);
    expect(result.current.imageError).toBe(false);
  });

  test('handles image load event', () => {
    const { result } = renderHook(() => useImageGallery());
    
    // Start with empty state, then call handler
    act(() => {
      result.current.handleImageLoad();
    });
    
    expect(result.current.imageLoading).toBe(false);
    expect(result.current.imageError).toBe(false);
  });

  test('handles image error event', () => {
    const { result } = renderHook(() => useImageGallery());
    
    // Start with empty state, then call handler
    act(() => {
      result.current.handleImageError();
    });
    
    expect(result.current.imageLoading).toBe(false);
    expect(result.current.imageError).toBe(true);
  });

  test('handles image change', () => {
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    const { result } = renderHook(() => useImageGallery(images));
    
    act(() => {
      result.current.handleImageChange(2);
    });
    
    expect(result.current.selectedImageIndex).toBe(2);
    expect(result.current.imageLoading).toBe(true);
    expect(result.current.imageError).toBe(false);
  });

  test('resets to first image when images array changes', () => {
    const initialImages = ['image1.jpg', 'image2.jpg'];
    const { result, rerender } = renderHook(
      ({ images }) => useImageGallery(images),
      { initialProps: { images: initialImages } }
    );
    
    // Change to second image
    act(() => {
      result.current.handleImageChange(1);
    });
    
    expect(result.current.selectedImageIndex).toBe(1);
    
    // Change images array
    const newImages = ['new1.jpg', 'new2.jpg'];
    rerender({ images: newImages });
    
    expect(result.current.selectedImageIndex).toBe(0);
  });

  test('handles image preload when complete', () => {
    mockImage.complete = true;
    const { result } = renderHook(() => useImageGallery(['image1.jpg']));
    
    // Simulate the image being already complete
    act(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    });
    
    expect(result.current.imageLoading).toBe(false);
    expect(result.current.imageError).toBe(false);
  });

  test('handles image preload setup', () => {
    mockImage.complete = false; // Image not in cache
    const { result } = renderHook(() => useImageGallery(['image1.jpg']));
    
    // Should set up the image gallery correctly
    expect(result.current.selectedImageIndex).toBe(0);
    // Verify handlers are available
    expect(typeof result.current.handleImageLoad).toBe('function');
    expect(typeof result.current.handleImageError).toBe('function');
    expect(typeof result.current.handleImageChange).toBe('function');
  });

  test('handles empty image source in checkImageLoaded', () => {
    const { result } = renderHook(() => useImageGallery(['']));
    
    // Should not crash with empty string
    expect(result.current.selectedImageIndex).toBe(0);
  });
});

describe('useQuantityDropdown Hook', () => {
  test('initial state with default stock', () => {
    const { result } = renderHook(() => useQuantityDropdown());
    
    expect(result.current.quantity).toBe(1);
    expect(result.current.isQuantityDropdownOpen).toBe(false);
  });

  test('initial state with custom stock', () => {
    const { result } = renderHook(() => useQuantityDropdown(5));
    
    expect(result.current.quantity).toBe(1);
    expect(result.current.isQuantityDropdownOpen).toBe(false);
  });

  test('generates correct quantity options for stock < 10', () => {
    const { result } = renderHook(() => useQuantityDropdown(5));
    
    const options = result.current.getQuantityOptions(5);
    
    expect(options).toEqual([1, 2, 3, 4, 5]);
  });

  test('generates correct quantity options for stock > 10', () => {
    const { result } = renderHook(() => useQuantityDropdown(15));
    
    const options = result.current.getQuantityOptions(15);
    
    expect(options).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('toggles dropdown state', () => {
    const { result } = renderHook(() => useQuantityDropdown());
    
    expect(result.current.isQuantityDropdownOpen).toBe(false);
    
    act(() => {
      result.current.toggleQuantityDropdown();
    });
    
    expect(result.current.isQuantityDropdownOpen).toBe(true);
    
    act(() => {
      result.current.toggleQuantityDropdown();
    });
    
    expect(result.current.isQuantityDropdownOpen).toBe(false);
  });

  test('toggles dropdown with event stopPropagation', () => {
    const { result } = renderHook(() => useQuantityDropdown());
    const mockEvent = {
      stopPropagation: jest.fn()
    } as unknown as React.MouseEvent;
    
    act(() => {
      result.current.toggleQuantityDropdown(mockEvent);
    });
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.isQuantityDropdownOpen).toBe(true);
  });

  test('selects quantity and closes dropdown', () => {
    const { result } = renderHook(() => useQuantityDropdown());
    
    // Open dropdown first
    act(() => {
      result.current.toggleQuantityDropdown();
    });
    
    expect(result.current.isQuantityDropdownOpen).toBe(true);
    
    // Select quantity
    act(() => {
      result.current.selectQuantity(3);
    });
    
    expect(result.current.quantity).toBe(3);
    expect(result.current.isQuantityDropdownOpen).toBe(false);
  });

  test('selects quantity with event stopPropagation', () => {
    const { result } = renderHook(() => useQuantityDropdown());
    const mockEvent = {
      stopPropagation: jest.fn()
    } as unknown as React.MouseEvent;
    
    act(() => {
      result.current.selectQuantity(2, mockEvent);
    });
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.quantity).toBe(2);
  });

  test('handles click outside to close dropdown', () => {
    const { result } = renderHook(() => useQuantityDropdown());
    
    // Open dropdown
    act(() => {
      result.current.toggleQuantityDropdown();
    });
    
    expect(result.current.isQuantityDropdownOpen).toBe(true);
    
    // Mock click outside
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const mockTarget = document.createElement('div');
    Object.defineProperty(clickEvent, 'target', { value: mockTarget });
    
    act(() => {
      document.dispatchEvent(clickEvent);
    });
    
    expect(result.current.isQuantityDropdownOpen).toBe(false);
  });

  test('does not close dropdown when clicking inside quantity dropdown', () => {
    const { result } = renderHook(() => useQuantityDropdown());
    
    // Create a mock element with quantity dropdown attribute
    const quantityElement = document.createElement('div');
    quantityElement.setAttribute('data-dropdown', 'quantity');
    document.body.appendChild(quantityElement);
    
    // Open dropdown
    act(() => {
      result.current.toggleQuantityDropdown();
    });
    
    expect(result.current.isQuantityDropdownOpen).toBe(true);
    
    // Mock click inside quantity dropdown
    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', { value: quantityElement });
    
    act(() => {
      document.dispatchEvent(clickEvent);
    });
    
    expect(result.current.isQuantityDropdownOpen).toBe(true);
    
    // Cleanup
    document.body.removeChild(quantityElement);
  });

  test('resets quantity to 1 when initialStock is 1', () => {
    const { result, rerender } = renderHook(
      ({ stock }) => useQuantityDropdown(stock),
      { initialProps: { stock: 5 } }
    );
    
    // Change quantity
    act(() => {
      result.current.selectQuantity(3);
    });
    
    expect(result.current.quantity).toBe(3);
    
    // Change stock to 1
    rerender({ stock: 1 });
    
    expect(result.current.quantity).toBe(1);
  });

  test('does not reset quantity when initialStock is not 1', () => {
    const { result, rerender } = renderHook(
      ({ stock }) => useQuantityDropdown(stock),
      { initialProps: { stock: 5 } }
    );
    
    // Change quantity
    act(() => {
      result.current.selectQuantity(3);
    });
    
    expect(result.current.quantity).toBe(3);
    
    // Change stock to different value (not 1)
    rerender({ stock: 10 });
    
    expect(result.current.quantity).toBe(3); // Should remain unchanged
  });
}); 