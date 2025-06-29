import { IQueryableRepository } from '../../common/repositories/repository.interface';
import { Product } from '../entities/product.entity';

export interface IProductRepository extends IQueryableRepository<Product> {
  findBySlug(slug: string): Promise<Product | null>;
  findByIdOrSlug(identifier: string): Promise<Product | null>;
  isSlugUnique(slug: string, excludeId?: string): Promise<boolean>;
  findBySellerId(sellerId: string): Promise<Product[]>;
} 