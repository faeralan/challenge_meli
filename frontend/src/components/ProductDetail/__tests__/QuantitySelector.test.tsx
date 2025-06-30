import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuantitySelector } from '../QuantitySelector';

// Mock the utility function
jest.mock('../../../utils/productUtils', () => ({
  formatPluralUnits: jest.fn(),
}));

const { formatPluralUnits } = require('../../../utils/productUtils');

describe('QuantitySelector Component', () => {
  const defaultProps = {
    stock: 10,
    quantity: 1,
    isQuantityDropdownOpen: false,
    getQuantityOptions: jest.fn(),
    toggleQuantityDropdown: jest.fn(),
    selectQuantity: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    formatPluralUnits.mockImplementation((quantity: number) => 
      quantity === 1 ? 'unidad' : 'unidades'
    );
    defaultProps.getQuantityOptions.mockReturnValue([1, 2, 3, 4, 5]);
  });

  test('renders "¡Último disponible!" when stock is 1', () => {
    render(<QuantitySelector {...defaultProps} stock={1} />);
    
    expect(screen.getByText('¡Último disponible!')).toBeInTheDocument();
    expect(screen.queryByText('Cantidad:')).not.toBeInTheDocument();
  });

  test('renders quantity selector when stock is greater than 1', () => {
    render(<QuantitySelector {...defaultProps} stock={5} />);
    
    expect(screen.getByText('Cantidad:')).toBeInTheDocument();
    expect(screen.queryByText('¡Último disponible!')).not.toBeInTheDocument();
  });

  test('displays current quantity and calls formatPluralUnits', () => {
    render(<QuantitySelector {...defaultProps} quantity={3} />);
    
    expect(formatPluralUnits).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button')).toHaveTextContent('3 unidades');
  });

  test('displays correct stock information', () => {
    render(<QuantitySelector {...defaultProps} stock={25} />);
    
    expect(screen.getByText('(25 disponibles)')).toBeInTheDocument();
  });

  test('calls toggleQuantityDropdown when button is clicked', () => {
    render(<QuantitySelector {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.toggleQuantityDropdown).toHaveBeenCalledTimes(1);
  });

  test('passes event to toggleQuantityDropdown when button is clicked', () => {
    render(<QuantitySelector {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.toggleQuantityDropdown).toHaveBeenCalledWith(expect.any(Object));
  });

  test('shows dropdown options when isQuantityDropdownOpen is true', () => {
    defaultProps.getQuantityOptions.mockReturnValue([1, 2, 3]);
    
    render(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={true} />);
    
    // Check that dropdown is open by data attribute
    const dropdown = screen.getByRole('button').closest('[data-dropdown="quantity"]');
    expect(dropdown).toHaveAttribute('data-open', 'true');
    
    // Check that we have multiple quantity elements (button + options)
    expect(screen.getAllByText(/unidad/)).toHaveLength(4); // button + 3 options
  });

  test('does not show dropdown options when isQuantityDropdownOpen is false', () => {
    defaultProps.getQuantityOptions.mockReturnValue([1, 2, 3]);
    
    render(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={false} />);
    
    // Check that dropdown is closed by data attribute
    const dropdown = screen.getByRole('button').closest('[data-dropdown="quantity"]');
    expect(dropdown).toHaveAttribute('data-open', 'false');
  });

  test('calls getQuantityOptions with correct stock', () => {
    render(<QuantitySelector {...defaultProps} stock={15} />);
    
    expect(defaultProps.getQuantityOptions).toHaveBeenCalledWith(15);
  });

  test('calls selectQuantity when option is clicked', () => {
    defaultProps.getQuantityOptions.mockReturnValue([1, 2, 3]);
    
    render(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={true} />);
    
    const option = screen.getByText('2 unidades');
    fireEvent.click(option);
    
    expect(defaultProps.selectQuantity).toHaveBeenCalledWith(2, expect.any(Object));
  });

  test('passes event to selectQuantity when option is clicked', () => {
    defaultProps.getQuantityOptions.mockReturnValue([1, 2, 3]);
    
    render(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={true} />);
    
    const option = screen.getByText('3 unidades');
    fireEvent.click(option);
    
    expect(defaultProps.selectQuantity).toHaveBeenCalledWith(3, expect.any(Object));
  });

  test('displays correct dropdown state data attribute', () => {
    const { rerender } = render(
      <QuantitySelector {...defaultProps} isQuantityDropdownOpen={false} />
    );
    
    let dropdown = screen.getByRole('button').closest('[data-dropdown="quantity"]');
    expect(dropdown).toHaveAttribute('data-open', 'false');
    
    rerender(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={true} />);
    dropdown = screen.getByRole('button').closest('[data-dropdown="quantity"]');
    expect(dropdown).toHaveAttribute('data-open', 'true');
  });

  test('renders dropdown arrow', () => {
    render(<QuantitySelector {...defaultProps} />);
    
    expect(screen.getByText('⌄')).toBeInTheDocument();
  });

  test('handles multiple quantity options correctly', () => {
    const largeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    defaultProps.getQuantityOptions.mockReturnValue(largeOptions);
    
    render(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={true} />);
    
    // Check that dropdown is open and we have all options
    const dropdown = screen.getByRole('button').closest('[data-dropdown="quantity"]');
    expect(dropdown).toHaveAttribute('data-open', 'true');
    
    // We should have button + 10 options = 11 elements with "unidad"
    expect(screen.getAllByText(/unidad/)).toHaveLength(11);
  });

  test('formatPluralUnits is called for each quantity option', () => {
    defaultProps.getQuantityOptions.mockReturnValue([1, 2, 3]);
    
    render(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={true} />);
    
    expect(formatPluralUnits).toHaveBeenCalledWith(1);
    expect(formatPluralUnits).toHaveBeenCalledWith(2);
    expect(formatPluralUnits).toHaveBeenCalledWith(3);
  });

  test('handles edge case with no quantity options', () => {
    defaultProps.getQuantityOptions.mockReturnValue([]);
    
    render(<QuantitySelector {...defaultProps} isQuantityDropdownOpen={true} />);
    
    // Should not crash and should only have the button (no dropdown options)
    const dropdown = screen.getByRole('button').closest('[data-dropdown="quantity"]');
    expect(dropdown).toHaveAttribute('data-open', 'true');
    
    // Only the button should contain "unidad", no dropdown options
    expect(screen.getAllByText(/unidad/)).toHaveLength(1);
  });

  test('displays correct styling for different stock levels', () => {
    const { rerender } = render(<QuantitySelector {...defaultProps} stock={1} />);
    
    const lastAvailable = screen.getByText('¡Último disponible!');
    expect(lastAvailable).toHaveStyle({
      fontSize: '16px',
      fontWeight: '600',
      color: '#000',
      margin: '0 0 16px 0'
    });
    
    rerender(<QuantitySelector {...defaultProps} stock={5} />);
    expect(screen.queryByText('¡Último disponible!')).not.toBeInTheDocument();
  });

  test('handles different quantity values correctly', () => {
    const { rerender } = render(<QuantitySelector {...defaultProps} quantity={1} />);
    expect(screen.getByRole('button')).toHaveTextContent('1 unidad');
    
    rerender(<QuantitySelector {...defaultProps} quantity={5} />);
    expect(screen.getByRole('button')).toHaveTextContent('5 unidades');
    
    rerender(<QuantitySelector {...defaultProps} quantity={10} />);
    expect(screen.getByRole('button')).toHaveTextContent('10 unidades');
  });
}); 