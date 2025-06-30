import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  test('renders MercadoLibre logo', () => {
    renderWithRouter(<Header />);
    
    const logo = screen.getByText(/MercadoLibre/i);
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  test('renders search form with input and button', () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText(/Buscar productos, marcas y más.../i);
    const buttons = screen.getAllByRole('button');
    
    expect(searchInput).toBeInTheDocument();
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('allows typing in search input', () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText(/Buscar productos, marcas y más.../i) as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    
    expect(searchInput.value).toBe('iPhone');
  });

  test('handles search form submission', () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText(/Buscar productos, marcas y más.../i);
    
    fireEvent.change(searchInput, { target: { value: 'test product' } });
    fireEvent.submit(searchInput.closest('form')!);
    
    // Form should not crash and input should maintain value
    expect(searchInput).toHaveValue('test product');
  });

  test('renders shopping cart and search buttons', () => {
    renderWithRouter(<Header />);
    
    const buttons = screen.getAllByRole('button');
    // Should have at least 2 buttons (search + cart)
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  test('renders login and register links', () => {
    renderWithRouter(<Header />);
    
    const loginLink = screen.getByText(/Ingresá/i);
    const registerLink = screen.getByText(/Creá tu cuenta/i);
    
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  test('buttons are clickable', () => {
    renderWithRouter(<Header />);
    
    const buttons = screen.getAllByRole('button');
    
    // Click each button to ensure they don't crash
    buttons.forEach(button => {
      fireEvent.click(button);
      expect(button).toBeInTheDocument();
    });
  });
}); 