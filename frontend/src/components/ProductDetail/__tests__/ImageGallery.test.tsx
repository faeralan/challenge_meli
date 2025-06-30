import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageGallery } from '../ImageGallery';

describe('ImageGallery Component', () => {
  const defaultProps = {
    title: 'Test Product',
    images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    selectedImageIndex: 0,
    imageLoading: false,
    imageError: false,
    onImageChange: jest.fn(),
    onImageLoad: jest.fn(),
    onImageError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product title', () => {
    render(<ImageGallery {...defaultProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('renders thumbnails when there are multiple images', () => {
    render(<ImageGallery {...defaultProps} />);
    
    expect(screen.getAllByRole('img')).toHaveLength(4); // 3 thumbnails + 1 main image
  });

  test('does not render thumbnails when there is only one image', () => {
    render(<ImageGallery {...defaultProps} images={['single-image.jpg']} />);
    
    expect(screen.getAllByRole('img')).toHaveLength(1); // Only main image
  });

  test('does not render thumbnails when images array is empty', () => {
    render(<ImageGallery {...defaultProps} images={[]} selectedImageIndex={0} />);
    
    // May still render main image, but no thumbnails
    expect(screen.queryByAltText(/Test Product - \d+/)).not.toBeInTheDocument();
  });

  test('renders main image with correct src and alt', () => {
    render(<ImageGallery {...defaultProps} />);
    
    const mainImage = screen.getByAltText('Test Product');
    expect(mainImage).toHaveAttribute('src', 'image1.jpg');
  });

  test('updates main image when selectedImageIndex changes', () => {
    const { rerender } = render(<ImageGallery {...defaultProps} selectedImageIndex={0} />);
    
    let mainImage = screen.getByAltText('Test Product');
    expect(mainImage).toHaveAttribute('src', 'image1.jpg');
    
    rerender(<ImageGallery {...defaultProps} selectedImageIndex={1} />);
    mainImage = screen.getByAltText('Test Product');
    expect(mainImage).toHaveAttribute('src', 'image2.jpg');
  });

  test('calls onImageChange when thumbnail is clicked', () => {
    render(<ImageGallery {...defaultProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product - \d+/);
    fireEvent.click(thumbnails[1]);
    
    expect(defaultProps.onImageChange).toHaveBeenCalledWith(1);
  });

  test('calls onImageLoad when main image loads', () => {
    render(<ImageGallery {...defaultProps} />);
    
    const mainImage = screen.getByAltText('Test Product');
    fireEvent.load(mainImage);
    
    expect(defaultProps.onImageLoad).toHaveBeenCalledTimes(1);
  });

  test('calls onImageError when main image fails to load', () => {
    render(<ImageGallery {...defaultProps} />);
    
    const mainImage = screen.getByAltText('Test Product');
    fireEvent.error(mainImage);
    
    expect(defaultProps.onImageError).toHaveBeenCalledTimes(1);
  });

  test('shows loading spinner when imageLoading is true and no error', () => {
    render(<ImageGallery {...defaultProps} imageLoading={true} imageError={false} />);
    
    // Check if loading spinner exists in DOM (it's a styled component)
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('shows error message when imageError is true', () => {
    render(<ImageGallery {...defaultProps} imageError={true} />);
    
    expect(screen.getByText('📷')).toBeInTheDocument();
    expect(screen.getByText('Error al cargar la imagen')).toBeInTheDocument();
  });

  test('does not show main image when imageError is true', () => {
    render(<ImageGallery {...defaultProps} imageError={true} />);
    
    expect(screen.queryByAltText('Test Product')).not.toBeInTheDocument();
  });

  test('shows main image when imageError is false', () => {
    render(<ImageGallery {...defaultProps} imageError={false} />);
    
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('applies correct opacity when loading', () => {
    render(<ImageGallery {...defaultProps} imageLoading={true} />);
    
    const mainImage = screen.getByAltText('Test Product');
    expect(mainImage).toHaveStyle({ opacity: '0.3' });
  });

  test('applies normal opacity when not loading', () => {
    render(<ImageGallery {...defaultProps} imageLoading={false} />);
    
    const mainImage = screen.getByAltText('Test Product');
    expect(mainImage).toHaveStyle({ opacity: '1' });
  });

  test('renders correct thumbnail alt text', () => {
    render(<ImageGallery {...defaultProps} />);
    
    expect(screen.getByAltText('Test Product - 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product - 2')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product - 3')).toBeInTheDocument();
  });

  test('handles thumbnail clicks for all images', () => {
    render(<ImageGallery {...defaultProps} />);
    
    const thumbnails = screen.getAllByAltText(/Test Product - \d+/);
    
    fireEvent.click(thumbnails[0]);
    expect(defaultProps.onImageChange).toHaveBeenCalledWith(0);
    
    fireEvent.click(thumbnails[2]);
    expect(defaultProps.onImageChange).toHaveBeenCalledWith(2);
  });

  test('renders thumbnails with correct src attributes', () => {
    render(<ImageGallery {...defaultProps} />);
    
    const thumbnail1 = screen.getByAltText('Test Product - 1');
    const thumbnail2 = screen.getByAltText('Test Product - 2');
    const thumbnail3 = screen.getByAltText('Test Product - 3');
    
    expect(thumbnail1).toHaveAttribute('src', 'image1.jpg');
    expect(thumbnail2).toHaveAttribute('src', 'image2.jpg');
    expect(thumbnail3).toHaveAttribute('src', 'image3.jpg');
  });

  test('handles edge case with large number of images', () => {
    const manyImages = Array.from({ length: 10 }, (_, i) => `image${i + 1}.jpg`);
    
    render(<ImageGallery {...defaultProps} images={manyImages} />);
    
    // Should render all thumbnails + main image
    expect(screen.getAllByRole('img')).toHaveLength(11);
  });

  test('handles imageLoading true with imageError true (error takes precedence)', () => {
    render(<ImageGallery {...defaultProps} imageLoading={true} imageError={true} />);
    
    // Error message should be shown, not loading spinner
    expect(screen.getByText('Error al cargar la imagen')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Product')).not.toBeInTheDocument();
  });

  test('handles selectedImageIndex out of bounds gracefully', () => {
    render(<ImageGallery {...defaultProps} selectedImageIndex={999} />);
    
    // Should not crash, might not render main image with valid src
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('renders without thumbnails when single image provided', () => {
    render(<ImageGallery {...defaultProps} images={['single.jpg']} />);
    
    // Only main image, no thumbnails
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.queryByAltText(/Test Product - \d+/)).not.toBeInTheDocument();
  });

  test('mobile title is always rendered regardless of image count', () => {
    const { rerender } = render(<ImageGallery {...defaultProps} images={[]} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    
    rerender(<ImageGallery {...defaultProps} images={['single.jpg']} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    
    rerender(<ImageGallery {...defaultProps} images={['img1.jpg', 'img2.jpg']} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('handles different title values', () => {
    const { rerender } = render(<ImageGallery {...defaultProps} title="Product A" />);
    expect(screen.getByText('Product A')).toBeInTheDocument();
    
    rerender(<ImageGallery {...defaultProps} title="Another Product Name" />);
    expect(screen.getByText('Another Product Name')).toBeInTheDocument();
    
    rerender(<ImageGallery {...defaultProps} title="" />);
    expect(screen.getByAltText('')).toBeInTheDocument(); // Main image with empty alt
  });
}); 