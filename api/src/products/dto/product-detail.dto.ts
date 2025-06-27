import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../interfaces/payment-method.interface';
import { Seller } from '../entities/seller.entity';

export class ProductDetailDto {
  @ApiProperty({ example: 'MLA123456789' })
  id: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max 256GB Space Black' })
  title: string;

  @ApiProperty({ example: 'iphone-14-pro-max-256gb-space-black' })
  slug: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max con 256GB de almacenamiento...' })
  description: string;

  @ApiProperty({ example: 850000 })
  price: number;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
  images: string[];

  @ApiProperty({ example: 'image1.jpg' })
  mainImage: string;

  @ApiProperty({ example: 10 })
  stock: number;

  @ApiProperty({ example: 'new', enum: ['new', 'used', 'refurbished'] })
  condition: 'new' | 'used' | 'refurbished';

  @ApiProperty({ example: 'Electronics' })
  category: string;

  @ApiProperty({ example: 'Apple' })
  brand?: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max' })
  model?: string;

  @ApiProperty({ type: Object })
  seller: Seller;

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({ example: 150 })
  totalReviews: number;

  @ApiProperty({ type: [Object] })
  paymentMethods: PaymentMethod[]; // Los métodos populados, no solo IDs

  @ApiProperty({ example: true })
  freeShipping: boolean;

  @ApiProperty({ example: '12 meses de garantía oficial' })
  warranty?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 