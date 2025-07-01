import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
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
  @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    example: ['image1.jpg', 'image2.jpg'], 
    description: 'Array de nombres de imágenes. Si se suben archivos, este campo es opcional',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      // Si viene como string separado por comas
      return value.split(',').map(v => v.trim()).filter(v => v.length > 0);
    }
    if (Array.isArray(value)) {
      return value;
    }
    // Si viene como un solo valor
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ 
    example: 'image1.jpg',
    description: 'Imagen principal del producto. Si se suben archivos, este campo es opcional',
    required: false
  })
  @IsOptional()
  @IsString()
  mainImage?: string;

  @ApiProperty({ example: 10 })
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @Type(() => Number)
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
  @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 150 })
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalReviews: number;

  @ApiProperty({ example: ['mercadopago', 'credit_card', 'debit_card'] })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Si viene como string separado por comas
      return value.split(',').map(v => v.trim());
    }
    if (Array.isArray(value)) {
      return value;
    }
    // Si viene como un solo valor
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  enabledPaymentMethods: string[];

  @ApiProperty({ example: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  })
  @IsBoolean()
  freeShipping: boolean;

  @ApiProperty({ example: '12 meses de garantía oficial', required: false })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiProperty({ 
    example: ['Capacidad: 64 GB', 'Incluye 2 controles', 'Pantalla táctil'], 
    required: false 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      // Si viene como string separado por comas
      return value.split(',').map(v => v.trim()).filter(v => v.length > 0);
    }
    if (Array.isArray(value)) {
      return value;
    }
    // Si viene como un solo valor
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({ 
    example: [
      { name: 'Rojo', image: 'https://example.com/red.jpg' },
      { name: 'Azul', image: 'https://example.com/blue.jpg' }
    ], 
    required: false 
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      try {
        // Si viene como JSON string
        return JSON.parse(value);
      } catch {
        // Si no es JSON válido, retornar undefined
        return undefined;
      }
    }
    return value;
  })
  @IsArray()
  availableColors?: { name: string; image: string; }[];
}
