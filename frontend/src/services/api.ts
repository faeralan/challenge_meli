import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Product, PaymentMethod, CreateProductDto } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Productos
  async getProducts(): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get('/products');
    return response.data;
  }

  async getProduct(identifier: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/${identifier}`);
    return response.data;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/slug/${slug}`);
    return response.data;
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.post('/products', productData);
    return response.data;
  }

  async updateProduct(id: string, productData: Partial<CreateProductDto>): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.patch(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  // Métodos de pago
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response: AxiosResponse<PaymentMethod[]> = await this.api.get('/products/payment-methods');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 