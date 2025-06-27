import { Seller } from './seller.entity';

export class Product {
  id: string;
  title: string;
  slug: string; // URL-friendly version of title
  description: string;
  price: number;
  images: string[];
  mainImage: string;
  stock: number;
  condition: 'new' | 'used' | 'refurbished';
  category: string;
  brand?: string;
  model?: string;
  
  // Seller information
  seller: Seller;
  
  // Rating & Reviews
  rating: number; // Promedio de calificaciones
  totalReviews: number;
  
  // Payment methods (array de IDs habilitados)
  enabledPaymentMethods: string[];
  
  // Additional info
  freeShipping: boolean;
  warranty?: string;
  createdAt: Date;
  updatedAt: Date;
}
