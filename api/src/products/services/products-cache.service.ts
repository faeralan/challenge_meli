import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Claves de caché
  private readonly CACHE_KEYS = {
    ALL_PRODUCTS: 'products:all',
    PRODUCT_BY_ID: (id: string) => `product:${id}`,
    FEATURED_PRODUCTS: 'products:featured',
    PRODUCTS_BY_CATEGORY: (category: string) => `products:category:${category}`,
  };

  // TTL específicos (en segundos)
  private readonly TTL = {
    ALL_PRODUCTS: 300, // 5 minutos
    SINGLE_PRODUCT: 600, // 10 minutos
    FEATURED_PRODUCTS: 900, // 15 minutos
    CATEGORY_PRODUCTS: 300, // 5 minutos
  };

  async getAllProducts(): Promise<Product[] | null> {
    try {
      return await this.cacheManager.get<Product[]>(this.CACHE_KEYS.ALL_PRODUCTS);
    } catch (error) {
      //console.error('Error getting products from cache:', error);
      return null;
    }
  }

  async setAllProducts(products: Product[]): Promise<void> {
    try {
      await this.cacheManager.set(
        this.CACHE_KEYS.ALL_PRODUCTS,
        products,
        this.TTL.ALL_PRODUCTS * 1000
      );
    } catch (error) {
      //console.error('Error setting products in cache:', error);
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await this.cacheManager.get<Product>(this.CACHE_KEYS.PRODUCT_BY_ID(id));
    } catch (error) {
      //console.error(`Error getting product ${id} from cache:`, error);
      return null;
    }
  }

  async setProductById(id: string, product: Product): Promise<void> {
    try {
      await this.cacheManager.set(
        this.CACHE_KEYS.PRODUCT_BY_ID(id),
        product,
        this.TTL.SINGLE_PRODUCT * 1000
      );
    } catch (error) {
      //console.error(`Error setting product ${id} in cache:`, error);
    }
  }

  async getFeaturedProducts(): Promise<Product[] | null> {
    try {
      return await this.cacheManager.get<Product[]>(this.CACHE_KEYS.FEATURED_PRODUCTS);
    } catch (error) {
      //console.error('Error getting featured products from cache:', error);
      return null;
    }
  }

  async setFeaturedProducts(products: Product[]): Promise<void> {
    try {
      await this.cacheManager.set(
        this.CACHE_KEYS.FEATURED_PRODUCTS,
        products,
        this.TTL.FEATURED_PRODUCTS * 1000
      );
    } catch (error) {
      //console.error('Error setting featured products in cache:', error);
    }
  }

  async getProductsByCategory(category: string): Promise<Product[] | null> {
    try {
      return await this.cacheManager.get<Product[]>(
        this.CACHE_KEYS.PRODUCTS_BY_CATEGORY(category)
      );
    } catch (error) {
      //console.error(`Error getting products by category ${category} from cache:`, error);
      return null;
    }
  }

  async setProductsByCategory(category: string, products: Product[]): Promise<void> {
    try {
      await this.cacheManager.set(
        this.CACHE_KEYS.PRODUCTS_BY_CATEGORY(category),
        products,
        this.TTL.CATEGORY_PRODUCTS * 1000
      );
    } catch (error) {
      //console.error(`Error setting products by category ${category} in cache:`, error);
    }
  }

  async invalidateAllProducts(): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.ALL_PRODUCTS);
      await this.cacheManager.del(this.CACHE_KEYS.FEATURED_PRODUCTS);
      console.log('All products cache invalidated');
    } catch (error) {
      //console.error('Error invalidating all products cache:', error);
    }
  }

  async invalidateProductById(id: string): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.PRODUCT_BY_ID(id));
      console.log(`Product ${id} cache invalidated`);
    } catch (error) {
      //console.error(`Error invalidating product ${id} cache:`, error);
    }
  }

  async invalidateProductsByCategory(category: string): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.PRODUCTS_BY_CATEGORY(category));
      console.log(`Products by category ${category} cache invalidated`);
    } catch (error) {
      //console.error(`Error invalidating products by category ${category} cache:`, error);
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      // Clear specific cache keys
      await this.cacheManager.del(this.CACHE_KEYS.ALL_PRODUCTS);
      await this.cacheManager.del(this.CACHE_KEYS.FEATURED_PRODUCTS);
      console.log('All cache cleared');
    } catch (error) {
      //console.error('Error clearing all cache:', error);
    }
  }
} 