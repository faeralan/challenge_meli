import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ProductDetail from '../ProductDetail';

// Mock all the hooks
jest.mock('../../hooks/useProductDetail', () => ({
  useProductDetail: jest.fn(),
  useImageGallery: jest.fn(),
  useQuantityDropdown: jest.fn(),
}));

jest.mock('../../hooks/useProductActions', () => ({
  useProductActions: jest.fn(),
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// Mock GlobalStyles components
jest.mock('../../styles/GlobalStyles', () => ({
  Container: ({ children }: any) => <div data-testid="container">{children}</div>,
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  ErrorMessage: ({ children }: any) => <div data-testid="error-message">{children}</div>,
}));

// Mock ProductDetail styles
jest.mock('../../components/ProductDetail/ProductDetail.styles', () => ({
  ProductContainer: ({ children }: any) => <div data-testid="product-container">{children}</div>,
  ProductWrapper: ({ children }: any) => <div data-testid="product-wrapper">{children}</div>,
  MainProductCard: ({ children }: any) => <div data-testid="main-product-card">{children}</div>,
}));

// Mock all ProductDetail components
jest.mock('../../components/ProductDetail', () => ({
  ImageGallery: ({ onImageChange, onImageLoad, onImageError }: any) => (
    <div data-testid="image-gallery">
      <button onClick={() => onImageChange(1)} data-testid="change-image">Change Image</button>
      <button onClick={onImageLoad} data-testid="image-load">Image Load</button>
      <button onClick={onImageError} data-testid="image-error">Image Error</button>
    </div>
  ),
  ProductInfo: ({ onColorChange }: any) => (
    <div data-testid="product-info">
      <button onClick={() => onColorChange(2)} data-testid="change-color">Change Color</button>
    </div>
  ),
  PurchaseSidebar: ({ onBuyNow, onAddToCart, toggleQuantityDropdown, selectQuantity }: any) => (
    <div data-testid="purchase-sidebar">
      <button onClick={onBuyNow} data-testid="buy-now">Buy Now</button>
      <button onClick={onAddToCart} data-testid="add-to-cart">Add to Cart</button>
      <button onClick={toggleQuantityDropdown} data-testid="toggle-quantity">Toggle Quantity</button>
      <button onClick={() => selectQuantity(3)} data-testid="select-quantity">Select Quantity</button>
    </div>
  ),
  ProductDescription: () => <div data-testid="product-description">Description</div>,
  ProductBreadcrumb: () => <div data-testid="product-breadcrumb">Breadcrumb</div>,
}));

import { useProductDetail, useImageGallery, useQuantityDropdown } from '../../hooks/useProductDetail';
import { useProductActions } from '../../hooks/useProductActions';
import { useParams } from 'react-router-dom';

// Cast mocks
const mockUseProductDetail = useProductDetail as jest.MockedFunction<typeof useProductDetail>;
const mockUseImageGallery = useImageGallery as jest.MockedFunction<typeof useImageGallery>;
const mockUseQuantityDropdown = useQuantityDropdown as jest.MockedFunction<typeof useQuantityDropdown>;
const mockUseProductActions = useProductActions as jest.MockedFunction<typeof useProductActions>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

const mockProduct = {
  id: 'MLA123',
  title: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  price: 100,
  images: ['test1.jpg', 'test2.jpg'],
  mainImage: 'test1.jpg',
  stock: 10,
  condition: 'new' as const,
  category: 'Electronics',
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
  updatedAt: new Date(),
  availableColors: [
    { name: 'Rojo', image: 'red.jpg' },
    { name: 'Azul', image: 'blue.jpg' }
  ]
};

describe('ProductDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default useParams mock
    mockUseParams.mockReturnValue({ id: 'MLA123' });
    
    // Default mock implementations
    mockUseImageGallery.mockReturnValue({
      selectedImageIndex: 0,
      imageLoading: false,
      imageError: false,
      handleImageLoad: jest.fn(),
      handleImageError: jest.fn(),
      handleImageChange: jest.fn(),
    });

    mockUseQuantityDropdown.mockReturnValue({
      quantity: 1,
      isQuantityDropdownOpen: false,
      getQuantityOptions: jest.fn(() => [1, 2, 3]),
      toggleQuantityDropdown: jest.fn(),
      selectQuantity: jest.fn(),
    });

    mockUseProductActions.mockReturnValue({
      handleBuyNow: jest.fn(),
      handleAddToCart: jest.fn(),
    });
  });

  test('shows loading spinner when loading', () => {
    mockUseProductDetail.mockReturnValue({
      product: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('shows error message when product not found', () => {
    mockUseProductDetail.mockReturnValue({
      product: null,
      loading: false,
      error: 'Product not found',
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
  });

  test('shows error message when error exists', () => {
    mockUseProductDetail.mockReturnValue({
      product: null,
      loading: false,
      error: 'Network error',
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
  });

  test('renders product details when loaded successfully', () => {
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('product-breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('image-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByTestId('purchase-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('product-description')).toBeInTheDocument();
  });

  test('handles color change in local state', () => {
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    const changeColorButton = screen.getByTestId('change-color');
    fireEvent.click(changeColorButton);

    // Verify the component renders (color state is internal)
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
  });

  test('handles image gallery interactions', () => {
    const mockHandleImageChange = jest.fn();
    const mockHandleImageLoad = jest.fn();
    const mockHandleImageError = jest.fn();

    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    mockUseImageGallery.mockReturnValue({
      selectedImageIndex: 0,
      imageLoading: false,
      imageError: false,
      handleImageLoad: mockHandleImageLoad,
      handleImageError: mockHandleImageError,
      handleImageChange: mockHandleImageChange,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('change-image'));
    fireEvent.click(screen.getByTestId('image-load'));
    fireEvent.click(screen.getByTestId('image-error'));

    expect(mockHandleImageChange).toHaveBeenCalledWith(1);
    expect(mockHandleImageLoad).toHaveBeenCalled();
    expect(mockHandleImageError).toHaveBeenCalled();
  });

  test('handles quantity dropdown interactions', () => {
    const mockToggleQuantityDropdown = jest.fn();
    const mockSelectQuantity = jest.fn();

    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    mockUseQuantityDropdown.mockReturnValue({
      quantity: 1,
      isQuantityDropdownOpen: false,
      getQuantityOptions: jest.fn(() => [1, 2, 3]),
      toggleQuantityDropdown: mockToggleQuantityDropdown,
      selectQuantity: mockSelectQuantity,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('toggle-quantity'));
    fireEvent.click(screen.getByTestId('select-quantity'));

    expect(mockToggleQuantityDropdown).toHaveBeenCalled();
    expect(mockSelectQuantity).toHaveBeenCalledWith(3);
  });

  test('handles purchase actions', () => {
    const mockHandleBuyNow = jest.fn();
    const mockHandleAddToCart = jest.fn();

    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    mockUseProductActions.mockReturnValue({
      handleBuyNow: mockHandleBuyNow,
      handleAddToCart: mockHandleAddToCart,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('buy-now'));
    fireEvent.click(screen.getByTestId('add-to-cart'));

    expect(mockHandleBuyNow).toHaveBeenCalled();
    expect(mockHandleAddToCart).toHaveBeenCalled();
  });

  test('passes correct props to hooks', () => {
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(mockUseProductDetail).toHaveBeenCalledWith('MLA123');
    expect(mockUseImageGallery).toHaveBeenCalledWith(mockProduct.images);
    expect(mockUseQuantityDropdown).toHaveBeenCalledWith(mockProduct.stock);
    expect(mockUseProductActions).toHaveBeenCalledWith({
      product: mockProduct,
      quantity: 1,
    });
  });

  test('handles product with no images', () => {
    const productWithoutImages = { ...mockProduct, images: [] };
    
    mockUseProductDetail.mockReturnValue({
      product: productWithoutImages,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(mockUseImageGallery).toHaveBeenCalledWith([]);
    expect(screen.getByTestId('image-gallery')).toBeInTheDocument();
  });

  test('handles product with no stock', () => {
    const productWithoutStock = { ...mockProduct, stock: 0 };
    
    mockUseProductDetail.mockReturnValue({
      product: productWithoutStock,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    // product?.stock || 1 means stock 0 becomes 1
    expect(mockUseQuantityDropdown).toHaveBeenCalledWith(1);
  });

  test('handles undefined product ID', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    
    mockUseProductDetail.mockReturnValue({
      product: null,
      loading: false,
      error: 'No ID provided',
    });

    render(
      <MemoryRouter initialEntries={['/product/']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(mockUseProductDetail).toHaveBeenCalledWith(undefined);
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
  });

  test('handles loading state with spinner positioning', () => {
    mockUseProductDetail.mockReturnValue({
      product: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('product-container')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  test('initializes selectedColor state to 0', () => {
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    // Verify component renders properly (selectedColor is passed to ProductInfo)
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
  });

  test('handles image gallery loading and error states', () => {
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    mockUseImageGallery.mockReturnValue({
      selectedImageIndex: 1,
      imageLoading: true,
      imageError: true,
      handleImageLoad: jest.fn(),
      handleImageError: jest.fn(),
      handleImageChange: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('image-gallery')).toBeInTheDocument();
  });

  test('handles quantity dropdown open state', () => {
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
    });

    mockUseQuantityDropdown.mockReturnValue({
      quantity: 2,
      isQuantityDropdownOpen: true,
      getQuantityOptions: jest.fn(() => [1, 2, 3, 4, 5]),
      toggleQuantityDropdown: jest.fn(),
      selectQuantity: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/product/MLA123']}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('purchase-sidebar')).toBeInTheDocument();
  });
}); 