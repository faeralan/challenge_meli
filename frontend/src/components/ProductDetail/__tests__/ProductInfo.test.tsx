import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductInfo } from '../ProductInfo';

// Mock the utility functions
jest.mock('../../../utils/productUtils', () => ({
  formatPrice: jest.fn((price) => `$${price.toLocaleString()}`),
  calculateInstallmentPrice: jest.fn((price) => price / 12),
  calculateSalesCount: jest.fn(() => Math.floor(Math.random() * 1000) + 1),
  getConditionText: jest.fn((condition) => condition === 'new' ? 'Nuevo' : 'Usado'),
}));

// Mock styled components
jest.mock('../ProductDetail.styles', () => ({
  ProductInfo: ({ children }: any) => <div data-testid="product-info">{children}</div>,
  ProductTitle: ({ children }: any) => <h1 data-testid="product-title">{children}</h1>,
  ProductCondition: ({ children }: any) => <span data-testid="product-condition">{children}</span>,
  ReviewsSection: ({ children }: any) => <div data-testid="reviews-section">{children}</div>,
  StarsContainer: ({ children }: any) => <div data-testid="stars-container">{children}</div>,
  StyledStar: ({ filled }: any) => <span data-testid={filled ? "star-filled" : "star-empty"}>⭐</span>,
  ReviewCount: ({ children }: any) => <span data-testid="review-count">{children}</span>,
  PriceSection: ({ children }: any) => <div data-testid="price-section">{children}</div>,
  Price: ({ children }: any) => <div data-testid="price">{children}</div>,
  InstallmentInfo: ({ children }: any) => <div data-testid="installment-info">{children}</div>,
  DiscountBadge: ({ children }: any) => <span data-testid="discount-badge">{children}</span>,
  BestSellerBadge: ({ children }: any) => <div data-testid="best-seller-badge">{children}</div>,
  ColorsSection: ({ children }: any) => <div data-testid="colors-section">{children}</div>,
  ColorsTitle: ({ children }: any) => <h3 data-testid="colors-title">{children}</h3>,
  ColorOptions: ({ children }: any) => <div data-testid="color-options">{children}</div>,
  ColorOption: ({ children, isSelected, onClick }: any) => (
    <button data-testid={`color-option-${isSelected ? 'selected' : 'unselected'}`} onClick={onClick}>
      {children}
    </button>
  ),
  FeaturesSection: ({ children }: any) => <div data-testid="features-section">{children}</div>,
  FeaturesTitle: ({ children }: any) => <h3 data-testid="features-title">{children}</h3>,
  FeaturesList: ({ children }: any) => <ul data-testid="features-list">{children}</ul>,
  FeatureItem: ({ children }: any) => <li data-testid="feature-item">{children}</li>,
}));

const defaultProps = {
  title: 'Test Product',
  condition: 'new',
  totalReviews: 150,
  rating: 4.5,
  price: 100000,
  selectedColor: 0,
  onColorChange: jest.fn(),
};

describe('ProductInfo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic product information', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByTestId('product-title')).toHaveTextContent('Test Product');
    expect(screen.getByTestId('product-condition')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-section')).toBeInTheDocument();
    expect(screen.getByTestId('price-section')).toBeInTheDocument();
  });

  test('calls utility functions correctly', () => {
    const mockUtils = require('../../../utils/productUtils');
    
    render(<ProductInfo {...defaultProps} />);

    expect(mockUtils.getConditionText).toHaveBeenCalledWith('new');
    expect(mockUtils.formatPrice).toHaveBeenCalledWith(100000);
    expect(mockUtils.calculateInstallmentPrice).toHaveBeenCalledWith(100000);
  });

  test('renders stars correctly based on rating', () => {
    render(<ProductInfo {...defaultProps} rating={3.7} />);

    const filledStars = screen.getAllByTestId('star-filled');
    const emptyStars = screen.getAllByTestId('star-empty');

    expect(filledStars).toHaveLength(3); // Math.floor(3.7) = 3
    expect(emptyStars).toHaveLength(2);
  });

  test('renders all 5 stars when rating is 5', () => {
    render(<ProductInfo {...defaultProps} rating={5} />);

    const filledStars = screen.getAllByTestId('star-filled');
    const emptyStars = screen.queryAllByTestId('star-empty');

    expect(filledStars).toHaveLength(5);
    expect(emptyStars).toHaveLength(0);
  });

  test('renders no filled stars when rating is 0', () => {
    render(<ProductInfo {...defaultProps} rating={0} />);

    const filledStars = screen.queryAllByTestId('star-filled');
    const emptyStars = screen.getAllByTestId('star-empty');

    expect(filledStars).toHaveLength(0);
    expect(emptyStars).toHaveLength(5);
  });

  test('displays best seller badge when criteria is met', () => {
    render(<ProductInfo {...defaultProps} totalReviews={150} rating={4.5} />);

    expect(screen.getByTestId('best-seller-badge')).toBeInTheDocument();
    expect(screen.getByTestId('best-seller-badge')).toHaveTextContent('MAS VENDIDO');
  });

  test('does not display best seller badge when reviews are insufficient', () => {
    render(<ProductInfo {...defaultProps} totalReviews={50} rating={4.5} />);

    expect(screen.queryByTestId('best-seller-badge')).not.toBeInTheDocument();
  });

  test('does not display best seller badge when rating is insufficient', () => {
    render(<ProductInfo {...defaultProps} totalReviews={150} rating={4.0} />);

    expect(screen.queryByTestId('best-seller-badge')).not.toBeInTheDocument();
  });

  test('displays rating with one decimal place', () => {
    render(<ProductInfo {...defaultProps} rating={4.67} />);

    const reviewCounts = screen.getAllByTestId('review-count');
    expect(reviewCounts[0]).toHaveTextContent('4.7');
  });

  test('renders available colors section when colors are provided', () => {
    const availableColors = [
      { name: 'Rojo', image: 'red.jpg' },
      { name: 'Azul', image: 'blue.jpg' },
    ];

    render(<ProductInfo {...defaultProps} availableColors={availableColors} />);

    expect(screen.getByTestId('colors-section')).toBeInTheDocument();
    expect(screen.getByTestId('colors-title')).toHaveTextContent('Color: Rojo');
    expect(screen.getByTestId('color-options')).toBeInTheDocument();
  });

  test('does not render colors section when no colors provided', () => {
    render(<ProductInfo {...defaultProps} availableColors={undefined} />);

    expect(screen.queryByTestId('colors-section')).not.toBeInTheDocument();
  });

  test('does not render colors section when empty colors array', () => {
    render(<ProductInfo {...defaultProps} availableColors={[]} />);

    expect(screen.queryByTestId('colors-section')).not.toBeInTheDocument();
  });

  test('handles color selection correctly', () => {
    const mockOnColorChange = jest.fn();
    const availableColors = [
      { name: 'Rojo', image: 'red.jpg' },
      { name: 'Azul', image: 'blue.jpg' },
    ];

    render(
      <ProductInfo 
        {...defaultProps} 
        availableColors={availableColors}
        onColorChange={mockOnColorChange}
        selectedColor={0}
      />
    );

    const colorButtons = screen.getAllByTestId(/color-option-(selected|unselected)/);
    fireEvent.click(colorButtons[1]); // Click second color

    expect(mockOnColorChange).toHaveBeenCalledWith(1);
  });

  test('shows selected color in title', () => {
    const availableColors = [
      { name: 'Rojo', image: 'red.jpg' },
      { name: 'Azul', image: 'blue.jpg' },
    ];

    render(
      <ProductInfo 
        {...defaultProps} 
        availableColors={availableColors}
        selectedColor={1}
      />
    );

    expect(screen.getByTestId('colors-title')).toHaveTextContent('Color: Azul');
  });

  test('renders features section when features are provided', () => {
    const features = ['Característica 1', 'Característica 2', 'Característica 3'];

    render(<ProductInfo {...defaultProps} features={features} />);

    expect(screen.getByTestId('features-section')).toBeInTheDocument();
    expect(screen.getByTestId('features-title')).toHaveTextContent('Lo que tienes que saber de este producto');
    expect(screen.getByTestId('features-list')).toBeInTheDocument();
    
    const featureItems = screen.getAllByTestId('feature-item');
    expect(featureItems).toHaveLength(3);
    expect(featureItems[0]).toHaveTextContent('Característica 1');
    expect(featureItems[1]).toHaveTextContent('Característica 2');
    expect(featureItems[2]).toHaveTextContent('Característica 3');
  });

  test('does not render features section when no features provided', () => {
    render(<ProductInfo {...defaultProps} features={undefined} />);

    expect(screen.queryByTestId('features-section')).not.toBeInTheDocument();
  });

  test('does not render features section when empty features array', () => {
    render(<ProductInfo {...defaultProps} features={[]} />);

    expect(screen.queryByTestId('features-section')).not.toBeInTheDocument();
  });

  test('handles edge case with selectedColor out of bounds', () => {
    const availableColors = [
      { name: 'Rojo', image: 'red.jpg' },
    ];

    render(
      <ProductInfo 
        {...defaultProps} 
        availableColors={availableColors}
        selectedColor={5} // Out of bounds
      />
    );

    // Should handle gracefully, title might be undefined but shouldn't crash
    expect(screen.getByTestId('colors-section')).toBeInTheDocument();
  });

  test('renders installment information', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByTestId('installment-info')).toHaveTextContent(/en 12 cuotas de/);
  });

  test('displays review count correctly', () => {
    render(<ProductInfo {...defaultProps} totalReviews={275} />);

    const reviewCounts = screen.getAllByTestId('review-count');
    // Should have rating and review count
    expect(reviewCounts.some(el => el.textContent?.includes('(275)'))).toBe(true);
  });

  test('handles very high rating correctly', () => {
    render(<ProductInfo {...defaultProps} rating={4.99} />);

    const filledStars = screen.getAllByTestId('star-filled');
    expect(filledStars).toHaveLength(4); // Math.floor(4.99) = 4
  });

  test('isBestSeller function edge cases', () => {
    // Test exact boundary conditions
    
    // Exactly 100 reviews, exactly 4.3 rating -> should be best seller
    render(<ProductInfo {...defaultProps} totalReviews={100} rating={4.3} />);
    expect(screen.getByTestId('best-seller-badge')).toBeInTheDocument();
  });

  test('best seller boundary - 99 reviews should not qualify', () => {
    render(<ProductInfo {...defaultProps} totalReviews={99} rating={4.5} />);
    expect(screen.queryByTestId('best-seller-badge')).not.toBeInTheDocument();
  });

  test('best seller boundary - 4.29 rating should not qualify', () => {
    render(<ProductInfo {...defaultProps} totalReviews={150} rating={4.29} />);
    expect(screen.queryByTestId('best-seller-badge')).not.toBeInTheDocument();
  });

  test('renders multiple color options correctly', () => {
    const availableColors = [
      { name: 'Rojo', image: 'red.jpg' },
      { name: 'Azul', image: 'blue.jpg' },
      { name: 'Verde', image: 'green.jpg' },
      { name: 'Negro', image: 'black.jpg' },
    ];

    render(<ProductInfo {...defaultProps} availableColors={availableColors} selectedColor={2} />);

    const colorButtons = screen.getAllByTestId(/color-option-(selected|unselected)/);
    expect(colorButtons).toHaveLength(4);
    expect(screen.getByTestId('colors-title')).toHaveTextContent('Color: Verde');
  });
}); 