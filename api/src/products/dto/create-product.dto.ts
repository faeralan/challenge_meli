import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'MLA123456789' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max 256GB Space Black' })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'iphone-14-pro-max-256gb-space-black', 
    description: 'URL-friendly version of title. If not provided, will be auto-generated from title',
    required: false 
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max con 256GB de almacenamiento...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 850000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: 'image1.jpg' })
  @IsString()
  mainImage: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'new', enum: ['new', 'used'] })
  @IsIn(['new', 'used'])
  condition: 'new' | 'used' ;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Apple', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  totalReviews: number;

  @ApiProperty({ example: ['mercadopago', 'credit_card', 'debit_card'] })
  @IsArray()
  @IsString({ each: true })
  enabledPaymentMethods: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  freeShipping: boolean;

  @ApiProperty({ example: '12 meses de garantía oficial', required: false })
  @IsOptional()
  @IsString()
  warranty?: string;
}
