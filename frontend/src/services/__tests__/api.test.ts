import axios, { AxiosResponse } from 'axios';

// Mock axios with inline mock implementation
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }))
}));

// Import service after mocking
import { apiService } from '../api';

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Get the mock axios instance that was created
const mockAxiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    test('fetches products successfully', async () => {
      const mockProducts = [
        { id: 'MLA123', title: 'Test Product', price: 100 },
        { id: 'MLA124', title: 'Another Product', price: 200 }
      ];
      const mockResponse: AxiosResponse = {
        data: mockProducts,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getProducts();
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });

    test('handles getProducts error', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(error);
      
      await expect(apiService.getProducts()).rejects.toThrow('Network error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
    });
  });

  describe('getProduct', () => {
    test('fetches single product by ID successfully', async () => {
      const mockProduct = { 
        id: 'MLA123', 
        title: 'Test Product', 
        price: 100,
        description: 'Test description'
      };
      const mockResponse: AxiosResponse = {
        data: mockProduct,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getProduct('MLA123');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/MLA123');
      expect(result).toEqual(mockProduct);
    });

    test('handles getProduct error', async () => {
      const error = new Error('Product not found');
      mockAxiosInstance.get.mockRejectedValue(error);
      
      await expect(apiService.getProduct('MLA999')).rejects.toThrow('Product not found');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/MLA999');
    });
  });

  describe('getProductBySlug', () => {
    test('fetches product by slug successfully', async () => {
      const mockProduct = { 
        id: 'MLA123', 
        slug: 'test-product',
        title: 'Test Product', 
        price: 100 
      };
      const mockResponse: AxiosResponse = {
        data: mockProduct,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getProductBySlug('test-product');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/slug/test-product');
      expect(result).toEqual(mockProduct);
    });

    test('handles getProductBySlug error', async () => {
      const error = new Error('Slug not found');
      mockAxiosInstance.get.mockRejectedValue(error);
      
      await expect(apiService.getProductBySlug('invalid-slug')).rejects.toThrow('Slug not found');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/slug/invalid-slug');
    });
  });

  describe('createProduct', () => {
    test('creates product successfully', async () => {
      const productData = {
        title: 'New Product',
        description: 'Product description',
        price: 200,
        images: ['image1.jpg'],
        mainImage: 'image1.jpg',
        stock: 10,
        condition: 'new' as const,
        category: 'Electronics',
        rating: 5,
        totalReviews: 0,
        enabledPaymentMethods: ['mercadopago'],
        freeShipping: true
      };
      const mockCreatedProduct = { id: 'MLA124', ...productData };
      const mockResponse: AxiosResponse = {
        data: mockCreatedProduct,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      
      const result = await apiService.createProduct(productData as any);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/products', productData);
      expect(result).toEqual(mockCreatedProduct);
    });

    test('handles createProduct error', async () => {
      const productData = { title: 'Invalid Product' };
      const error = new Error('Validation failed');
      mockAxiosInstance.post.mockRejectedValue(error);
      
      await expect(apiService.createProduct(productData as any)).rejects.toThrow('Validation failed');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/products', productData);
    });
  });

  describe('updateProduct', () => {
    test('updates product successfully', async () => {
      const updateData = { title: 'Updated Product', price: 300 };
      const mockUpdatedProduct = { id: 'MLA123', ...updateData };
      const mockResponse: AxiosResponse = {
        data: mockUpdatedProduct,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.patch.mockResolvedValue(mockResponse);
      
      const result = await apiService.updateProduct('MLA123', updateData);
      
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/products/MLA123', updateData);
      expect(result).toEqual(mockUpdatedProduct);
    });

    test('handles updateProduct error', async () => {
      const updateData = { price: -100 }; // Invalid data
      const error = new Error('Invalid update data');
      mockAxiosInstance.patch.mockRejectedValue(error);
      
      await expect(apiService.updateProduct('MLA123', updateData)).rejects.toThrow('Invalid update data');
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/products/MLA123', updateData);
    });
  });

  describe('deleteProduct', () => {
    test('deletes product successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: undefined,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
      
      await apiService.deleteProduct('MLA123');
      
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/products/MLA123');
    });

    test('handles deleteProduct error', async () => {
      const error = new Error('Product not found');
      mockAxiosInstance.delete.mockRejectedValue(error);
      
      await expect(apiService.deleteProduct('MLA999')).rejects.toThrow('Product not found');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/products/MLA999');
    });
  });

  describe('getPaymentMethods', () => {
    test('fetches payment methods successfully', async () => {
      const mockPaymentMethods = [
        { id: 'visa', name: 'VISA' },
        { id: 'mastercard', name: 'Mastercard' },
        { id: 'mercadopago', name: 'MercadoPago' }
      ];
      const mockResponse: AxiosResponse = {
        data: mockPaymentMethods,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await apiService.getPaymentMethods();
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/payment-methods');
      expect(result).toEqual(mockPaymentMethods);
    });

    test('handles getPaymentMethods error', async () => {
      const error = new Error('Payment methods service unavailable');
      mockAxiosInstance.get.mockRejectedValue(error);
      
      await expect(apiService.getPaymentMethods()).rejects.toThrow('Payment methods service unavailable');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/payment-methods');
    });
  });
}); 