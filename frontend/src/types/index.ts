export interface User {
  id: string;
  email: string;
  name: string;
  reputation: number;
  location: string;
  salesCount: number;
  joinDate: Date;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerInfo {
  id: string;
  name: string;
  reputation: number;
  location: string;
  salesCount: number;
  joinDate: Date;
  isVerified: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  maxInstallments?: number;
  description?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  mainImage: string;
  stock: number;
  condition: 'new' | 'used' | 'refurbished';
  category: string;
  brand?: string;
  model?: string;
  seller: SellerInfo;
  rating: number;
  totalReviews: number;
  paymentMethods: PaymentMethod[];
  freeShipping: boolean;
  warranty?: string;
  features?: string[];
  availableColors?: { name: string; image: string; }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  id: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  images: string[];
  mainImage: string;
  stock: number;
  condition: 'new' | 'used';
  category: string;
  brand?: string;
  model?: string;
  rating: number;
  totalReviews: number;
  enabledPaymentMethods: string[];
  freeShipping: boolean;
  warranty?: string;
  features?: string[];
  availableColors?: { name: string; image: string; }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 