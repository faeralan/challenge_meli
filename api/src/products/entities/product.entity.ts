import { User } from '../../users/entities/user.entity';

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
  
  // Seller information - ahora usa User directamente
  seller: User;
  
  // Rating & Reviews
  rating: number; // Promedio de calificaciones
  totalReviews: number;
  
  // Payment methods (array de IDs habilitados)
  enabledPaymentMethods: string[];
  
  // Additional info
  freeShipping: boolean;
  warranty?: string;
  features?: string[];
  availableColors?: { name: string; image: string; }[];
  createdAt: Date;
  updatedAt: Date;
}
