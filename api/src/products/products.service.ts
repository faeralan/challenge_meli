import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDetailDto } from './dto/product-detail.dto';
import { SellerInfoDto } from '../users/dto/seller-info.dto';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PAYMENT_METHODS } from './constants/payment-methods.constant';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'products.json');

  constructor(private readonly usersService: UsersService) {}

  private async loadProducts(): Promise<Product[]> {
    try {
      if (!fs.existsSync(this.dataPath)) {
        // Create directory and file if it doesn't exist
        const dataDir = path.dirname(this.dataPath);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
        return [];
      }

      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error loading products: ${error.message}`);
    }
  }

  private async saveProducts(products: Product[]): Promise<void> {
    try {
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(this.dataPath, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error(`Error saving products: ${error.message}`);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD') // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single
  }

  private async checkUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const products = await this.loadProducts();
    let slug = baseSlug;
    let counter = 1;

    while (products.some(p => p.slug === slug && p.id !== excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // Methods to map the user to the seller info
  private mapUserToSellerInfo(user: User): SellerInfoDto {
    return {
      id: user.id,
      name: user.name,
      reputation: user.reputation,
      location: user.location,
      salesCount: user.salesCount,
      joinDate: user.joinDate,
      isVerified: user.isVerified,
    };
  }

  private mapToProductDetail(product: Product): ProductDetailDto {
    // Filter only enabled payment methods for this product
    const availablePaymentMethods = PAYMENT_METHODS.filter(
      method => product.enabledPaymentMethods.includes(method.id)
    );

    return {
      ...product,
      seller: this.mapUserToSellerInfo(product.seller),
      paymentMethods: availablePaymentMethods
    };
  }

  async create(createProductDto: CreateProductDto, user: User): Promise<Product> {
    const products = await this.loadProducts();
    
    // Check if the ID already exists
    const existingProduct = products.find(p => p.id === createProductDto.id);
    if (existingProduct) {
      throw new Error(`Product with ID ${createProductDto.id} already exists`);
    }

    // Generate slug if not provided
    const baseSlug = createProductDto.slug || this.generateSlug(createProductDto.title);
    const uniqueSlug = await this.checkUniqueSlug(baseSlug);

    const newProduct: Product = {
      ...createProductDto,
      seller: user,
      slug: uniqueSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    products.push(newProduct);
    await this.saveProducts(products);
    
    // Increment salesCount of the seller
    await this.usersService.incrementSalesCount(user.id);
    
    return newProduct;
  }

  async findAll(): Promise<ProductDetailDto[]> {
    const products = await this.loadProducts();
    return products.map(product => this.mapToProductDetail(product));
  }

  async findOne(identifier: string): Promise<ProductDetailDto> {
    const products = await this.loadProducts();
    const product = products.find(p => p.id === identifier || p.slug === identifier);
    
    if (!product) {
      throw new NotFoundException(`Product with ID or slug '${identifier}' not found`);
    }

    return this.mapToProductDetail(product);
  }

  async findBySlug(slug: string): Promise<ProductDetailDto> {
    const products = await this.loadProducts();
    const product = products.find(p => p.slug === slug);
    
    if (!product) {
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }

    return this.mapToProductDetail(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const products = await this.loadProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // If title is being updated, regenerate slug
    let updatedSlug = products[productIndex].slug;
    if (updateProductDto.title && updateProductDto.title !== products[productIndex].title) {
      const baseSlug = updateProductDto.slug || this.generateSlug(updateProductDto.title);
      updatedSlug = await this.checkUniqueSlug(baseSlug, id);
    } else if (updateProductDto.slug) {
      updatedSlug = await this.checkUniqueSlug(updateProductDto.slug, id);
    }

    const updatedProduct: Product = {
      ...products[productIndex],
      ...updateProductDto,
      slug: updatedSlug,
      updatedAt: new Date(),
    };

    products[productIndex] = updatedProduct;
    await this.saveProducts(products);
    
    return updatedProduct;
  }

  async remove(id: string, userId: string): Promise<void> {
    const products = await this.loadProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const product = products[productIndex];
    
    // Verify that the user is the owner of the product
    if (product.seller.id !== userId) {
      throw new ForbiddenException('You are not authorized to delete this product. Only the owner can delete it.');
    }

    products.splice(productIndex, 1);
    await this.saveProducts(products);
  }

  // Auxiliary method to get all available payment methods
  getAvailablePaymentMethods() {
    return PAYMENT_METHODS;
  }
}
