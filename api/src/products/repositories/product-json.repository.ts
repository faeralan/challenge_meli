import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BaseJsonRepository } from '../../common/repositories/base-json.repository';
import { IProductRepository } from './product.repository.interface';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductJsonRepository extends BaseJsonRepository<Product> implements IProductRepository {
  protected readonly fileName = 'products.json';

  // Generate unique MLA ID
  private async generateUniqueId(): Promise<string> {
    const products = await this.loadData();
    let newId: string;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      // Generate random 9-digit number
      const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
      newId = `MLA${randomNumber}`;
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new InternalServerErrorException('Unable to generate unique product ID after maximum attempts');
      }
    } while (products.some(product => product.id === newId));

    return newId;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const products = await this.loadData();
    return products.find(product => product.slug === slug) || null;
  }

  async findByIdOrSlug(identifier: string): Promise<Product | null> {
    const products = await this.loadData();
    return products.find(product => 
      product.id === identifier || product.slug === identifier
    ) || null;
  }

  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const products = await this.loadData();
    return !products.some(product => product.slug === slug && product.id !== excludeId);
  }

  // Helper method to generate unique slug
  async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (!(await this.isSlugUnique(slug, excludeId))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // Override create to handle slug generation and auto-generate ID
  async create(productData: Product): Promise<Product> {
    const products = await this.loadData();
    
    // Generate unique ID automatically (ignore the ID from DTO)
    const uniqueId = await this.generateUniqueId();
    
    // Ensure unique slug
    const uniqueSlug = await this.generateUniqueSlug(productData.slug);

    const newProduct: Product = {
      ...productData,
      id: uniqueId, // Use auto-generated ID
      slug: uniqueSlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    products.push(newProduct);
    await this.saveData(products);
    
    return newProduct;
  }

  // Override update to handle slug changes
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Handle slug updates
    if (updates.slug) {
      updates.slug = await this.generateUniqueSlug(updates.slug, id);
    }

    return super.update(id, updates);
  }
} 