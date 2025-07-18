import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDetailDto } from './dto/product-detail.dto';
import { SellerInfoDto } from '../users/dto/seller-info.dto';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { IProductRepository } from './repositories/product.repository.interface';
import { PAYMENT_METHODS } from './constants/payment-methods.constant';
import { ConfigService } from '@nestjs/config';
import { ProductsCacheService } from './services/products-cache.service';
import { Warranty } from './interfaces/warranty.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly cacheService: ProductsCacheService
  ) {}

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

  private processUploadedFiles(files: Express.Multer.File[]): { images: string[]; mainImage: string } {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files not valid');
    }

    const port = this.configService.get('PORT') || '3000';
    const baseUrl = this.configService.get('API_BASE_URL') || `http://localhost:${port}`;
    const imageUrls = files.map(file => `${baseUrl}/uploads/temp/${file.filename}`);
    
    return {
      images: imageUrls,
      mainImage: imageUrls[0], // First image as main image
    };
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

  async create(
    createProductDto: CreateProductDto, 
    user: User, 
    files?: Express.Multer.File[]
  ): Promise<ProductDetailDto> {
    // Generate slug if not provided
    const baseSlug = createProductDto.slug || this.generateSlug(createProductDto.title);

    let images: string[];
    let mainImage: string;

    // If files are provided, process them. Otherwise, use the images from the DTO
    if (files && files.length > 0) {
      const processedFiles = this.processUploadedFiles(files);
      images = processedFiles.images;
      mainImage = processedFiles.mainImage;
    } else if (createProductDto.images && createProductDto.images.length > 0) {
      images = createProductDto.images;
      mainImage = createProductDto.mainImage || createProductDto.images[0];
    } else {
      throw new BadRequestException(
        'You must provide at least one image, either by uploading files or providing URLs'
      );
    }

    // Validación de warranty en creación
    if (
      typeof createProductDto.warranty !== 'undefined' &&
      createProductDto.warranty &&
      (typeof createProductDto.warranty.status === 'undefined' || typeof createProductDto.warranty.value === 'undefined')
    ) {
      throw new BadRequestException('Warranty must have both status and value');
    }

    let warranty: Warranty | undefined = undefined;
    if (createProductDto.warranty && createProductDto.warranty.status !== undefined && createProductDto.warranty.value !== undefined) {
      warranty = { status: createProductDto.warranty.status, value: createProductDto.warranty.value };
    }

    const newProduct: Product = {
      ...createProductDto,
      id: 'TEMP_ID', // Temporary ID (will be auto-generated by repository)
      seller: user,
      slug: baseSlug,
      images,
      mainImage,
      createdAt: new Date(),
      updatedAt: new Date(),
      warranty,
    };

    const savedProduct = await this.productRepository.create(newProduct);
    
    // Invalidate cache when new product is created
    await this.cacheService.invalidateAllProducts();
    // console.log('Cache invalidated after product creation');
    
    // Increment salesCount of the seller
    await this.usersService.incrementSalesCount(user.id);
    
    return this.mapToProductDetail(savedProduct);
  }

  async findAll(): Promise<ProductDetailDto[]> {
    // Try to get from cache first
    const cachedProducts = await this.cacheService.getAllProducts();
    
    if (cachedProducts) {
      // console.log('Products retrieved from cache');
      return cachedProducts.map(product => this.mapToProductDetail(product));
    }

    // console.log('Products retrieved from database');
    const products = await this.productRepository.findAll();
    
    // Cache the results
    await this.cacheService.setAllProducts(products);
    
    return products.map(product => this.mapToProductDetail(product));
  }

  async findOne(identifier: string): Promise<ProductDetailDto> {
    // Try to get from cache first (only for ID, not slug)
    if (identifier.length > 10) { // Assuming IDs are longer than 10 chars
      const cachedProduct = await this.cacheService.getProductById(identifier);
      
      if (cachedProduct) {
        // console.log(`Product ${identifier} retrieved from cache`);
        return this.mapToProductDetail(cachedProduct);
      }
    }

    // console.log(`Product ${identifier} retrieved from database`);
    const product = await this.productRepository.findByIdOrSlug(identifier);
    
    if (!product) {
      throw new NotFoundException(`Product with identifier '${identifier}' not found`);
    }

    // Cache the result if it was retrieved by ID
    if (identifier === product.id) {
      await this.cacheService.setProductById(product.id, product);
    }

    return this.mapToProductDetail(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<ProductDetailDto> {
    const existingProduct = await this.productRepository.findById(id);
    
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Al crear updates, eliminar warranty del spread para evitar conflicto de tipos
    const { warranty: _warranty, ...restUpdateProductDto } = updateProductDto;
    const updates: Partial<Product> = { ...restUpdateProductDto };

    // Handle slug generation if title is being updated
    if (updateProductDto.title && updateProductDto.title !== existingProduct.title) {
      const baseSlug = updateProductDto.slug || this.generateSlug(updateProductDto.title);
      // Generate unique slug using repository method to ensure uniqueness
      updates.slug = await this.productRepository.generateUniqueSlug(baseSlug, id);
    } else if (updateProductDto.slug && updateProductDto.slug !== existingProduct.slug) {
      // Validate slug uniqueness only if it's different from current slug
      const isUnique = await this.productRepository.isSlugUnique(updateProductDto.slug, id);
      if (!isUnique) {
        // Generate unique slug if provided slug already exists
        updates.slug = await this.productRepository.generateUniqueSlug(updateProductDto.slug, id);
      } else {
        updates.slug = updateProductDto.slug;
      }
    }

    // Handle image updates if files are provided or new image URLs are in the DTO
    if (files && files.length > 0) {
      // If files are uploaded, process them and replace existing images
      const processedFiles = this.processUploadedFiles(files);
      updates.images = processedFiles.images;
      updates.mainImage = processedFiles.mainImage;
    } else if (updateProductDto.images && updateProductDto.images.length > 0) {
      // If image URLs are provided in DTO, use them and replace existing images
      updates.images = updateProductDto.images;
      updates.mainImage = updateProductDto.mainImage || updateProductDto.images[0];
    } else {
      // If neither files nor image URLs are provided, remove images/mainImage from updates to keep existing
      delete updates.images;
      delete updates.mainImage;
    }

    // Warranty: assign only if both fields exist, and ensure type compatibility
    if (typeof updateProductDto.warranty !== 'undefined') {
      const w = updateProductDto.warranty;
      if (w && typeof w.status !== 'undefined' && typeof w.value !== 'undefined') {
        updates.warranty = { status: w.status ?? false, value: w.value ?? '' };
      } else {
        updates.warranty = undefined;
      }
    } else {
      delete updates.warranty;
    }

    // enabledPaymentMethods: only update if present
    if (typeof updateProductDto.enabledPaymentMethods !== 'undefined') {
      updates.enabledPaymentMethods = updateProductDto.enabledPaymentMethods;
    } else {
      delete updates.enabledPaymentMethods;
    }

    // features: only update if present
    if (typeof updateProductDto.features !== 'undefined') {
      updates.features = updateProductDto.features;
    } else {
      delete updates.features;
    }

    // availableColors: only update if present
    if (typeof updateProductDto.availableColors !== 'undefined') {
      updates.availableColors = updateProductDto.availableColors;
    } else {
      delete updates.availableColors;
    }

    const updatedProduct = await this.productRepository.update(id, updates);
    
    // Invalidate cache when product is updated
    await this.cacheService.invalidateProductById(id);
    await this.cacheService.invalidateAllProducts();
    // console.log(`Cache invalidated after product ${id} update`);
    
    return this.mapToProductDetail(updatedProduct);
  }

  async remove(id: string, userId: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Verify that the user is the owner of the product
    if (product.seller.id !== userId) {
      throw new ForbiddenException('You are not authorized to delete this product. Only the owner can delete it.');
    }

    const deleted = await this.productRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Invalidate cache when product is deleted
    await this.cacheService.invalidateProductById(id);
    await this.cacheService.invalidateAllProducts();
    // console.log(`Cache invalidated after product ${id} deletion`);
  }

  getAvailablePaymentMethods() {
    return PAYMENT_METHODS;
  }
}
