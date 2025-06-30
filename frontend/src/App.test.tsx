import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the API service
jest.mock('./services/api', () => ({
  apiService: {
    getProducts: jest.fn().mockResolvedValue([])
  }
}));

// Mock React Router hooks properly
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

test('renders App without crashing', () => {
  render(<App />);
  
  // App should render without errors
  expect(document.querySelector('.App')).toBeInTheDocument();
});

test('renders MercadoLibre header', async () => {
  render(<App />);
  
  await waitFor(() => {
    const headerElement = screen.getByText(/MercadoLibre/i);
    expect(headerElement).toBeInTheDocument();
  });
});

test('renders main content area', () => {
  render(<App />);
  
  const mainElement = screen.getByRole('main');
  expect(mainElement).toBeInTheDocument();
});
