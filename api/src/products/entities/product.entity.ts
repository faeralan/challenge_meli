import { User } from '../../users/entities/user.entity';
import { Warranty } from '../interfaces/warranty.interface';

export class Product {
  id: string;
  title: string;
  slug: string; // URL-friendly version of title
  description: string;
  price: number;
  images: string[];
  mainImage: string;
  stock: number;
  condition: 'new' | 'used' ;
  category: string;
  brand?: string;
  model?: string;
  
  // Seller information - now uses User directly
  seller: User;
  
  // Rating & Reviews
  rating: number; // Average rating
  totalReviews: number;
  
  // Payment methods (array of enabled IDs)
  enabledPaymentMethods: string[];
  
  // Additional info
  freeShipping: boolean;
  warranty?: Warranty;
  features?: string[];
  availableColors?: { name: string; image: string; }[];
  createdAt: Date;
  updatedAt: Date;
}
