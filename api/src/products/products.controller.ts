import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  UseInterceptors,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDetailDto } from './dto/product-detail.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { multerConfig } from './config/multer.config';
import { RedisConnectionService } from './services/redis-connection.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly redisConnectionService: RedisConnectionService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del producto. Puede incluir archivos de imagen en el campo "images" (hasta 10 archivos, máximo 5MB cada uno)',
    schema: {
      type: 'object',
      properties: {
        // Campos de archivo
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Archivos de imagen (opcional si se proporcionan URLs)',
        },
        // Campos requeridos del producto
        title: {
          type: 'string',
          example: 'iPhone 14 Pro Max 256GB Space Black',
        },
        description: {
          type: 'string',
          example: 'iPhone 14 Pro Max con 256GB de almacenamiento...',
        },
        price: {
          type: 'number',
          example: 850000,
        },
        stock: {
          type: 'number',
          example: 10,
        },
        condition: {
          type: 'string',
          enum: ['new', 'used'],
          example: 'new',
        },
        category: {
          type: 'string',
          example: 'Electronics',
        },
        rating: {
          type: 'number',
          example: 4.5,
        },
        totalReviews: {
          type: 'number',
          example: 150,
        },
        enabledPaymentMethods: {
          type: 'array',
          items: { 
            type: 'string',
            enum: ['mercadopago', 'visa_credit', 'visa_debit', 'mastercard_credit', 'mastercard_debit', 'pagofacil']
          },
          example: ['mercadopago', 'visa_credit', 'mastercard_debit'],
          description: 'Métodos de pago habilitados. Solo se permiten: mercadopago, visa_credit, visa_debit, mastercard_credit, mastercard_debit, pagofacil'
        },
        freeShipping: {
          type: 'boolean',
          example: true,
        },
        // Campos opcionales
        brand: {
          type: 'string',
          example: 'Apple',
        },
        model: {
          type: 'string',
          example: 'iPhone 14 Pro Max',
        },
        warranty: {
          type: 'object',
          properties: {
            status: { type: 'boolean', example: true },
            value: { type: 'string', example: '12 meses de garantía oficial' }
          },
          description: 'Información de garantía del producto',
        },
        features: {
          type: 'array',
          items: { type: 'string' },
          example: ['Capacidad: 64 GB', 'Incluye 2 controles'],
        },
      },
      required: ['title', 'description', 'price', 'stock', 'condition', 'category', 'rating', 'totalReviews', 'enabledPaymentMethods', 'freeShipping'],
    },
  })
  @ApiOperation({ 
    summary: 'Create a new product (requires authentication)',
    description: `
    Crea un nuevo producto. Puede recibir archivos de imagen mediante el campo "images" (hasta 10 archivos, máximo 5MB cada uno).
    
    **Formas de uso:**
    1. **Con archivos:** Subir archivos usando el campo "images" en multipart/form-data
    2. **Con URLs:** Enviar las URLs de imágenes en el campo JSON "images"
    3. **Mixto:** Combinar ambos métodos
    
    **Nota:** Debe proporcionar al menos una imagen por cualquiera de los métodos.
    `
  })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductDetailDto })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file type, size, or missing images' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createProductDto: CreateProductDto, 
    @CurrentUser() user: User,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    // Validar que hay imágenes (archivos subidos o URLs en el DTO)
    if (!files?.length && !createProductDto.images?.length) {
      throw new BadRequestException(
        'Debes proporcionar al menos una imagen, ya sea subiendo archivos o proporcionando URLs en el campo images'
      );
    }

    return await this.productsService.create(createProductDto, user, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products', type: [ProductDetailDto] })
  async findAll(): Promise<ProductDetailDto[]> {
    return await this.productsService.findAll();
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({ status: 200, description: 'List of available payment methods' })
  getPaymentMethods() {
    return this.productsService.getAvailablePaymentMethods();
  }



  @Get(':term')
  @ApiOperation({ summary: 'Get product detail by ID or slug' })
  @ApiResponse({ status: 200, description: 'Product detail', type: ProductDetailDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('term') term: string): Promise<ProductDetailDto> {
    return await this.productsService.findOne(term);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del producto para actualizar. Puede incluir nuevos archivos de imagen en el campo "images" (hasta 10 archivos, máximo 5MB cada uno)',
    schema: {
      type: 'object',
      properties: {
        // Campos de archivo
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Archivos de imagen nuevos (opcional)',
        },
        // Campos actualizables del producto
        title: {
          type: 'string',
          example: 'iPhone 14 Pro Max 256GB Space Black',
        },
        description: {
          type: 'string',
          example: 'iPhone 14 Pro Max con 256GB de almacenamiento...',
        },
        price: {
          type: 'number',
          example: 850000,
        },
        stock: {
          type: 'number',
          example: 10,
        },
        condition: {
          type: 'string',
          enum: ['new', 'used'],
          example: 'new',
        },
        category: {
          type: 'string',
          example: 'Electronics',
        },
        rating: {
          type: 'number',
          example: 4.5,
        },
        totalReviews: {
          type: 'number',
          example: 150,
        },
        enabledPaymentMethods: {
          type: 'array',
          items: { 
            type: 'string',
            enum: ['mercadopago', 'visa_credit', 'visa_debit', 'mastercard_credit', 'mastercard_debit', 'pagofacil']
          },
          example: ['mercadopago', 'visa_credit', 'mastercard_debit'],
          description: 'Métodos de pago habilitados. Solo se permiten: mercadopago, visa_credit, visa_debit, mastercard_credit, mastercard_debit, pagofacil'
        },
        freeShipping: {
          type: 'boolean',
          example: true,
        },
        brand: {
          type: 'string',
          example: 'Apple',
        },
        model: {
          type: 'string',
          example: 'iPhone 14 Pro Max',
        },
        warranty: {
          type: 'object',
          properties: {
            status: { type: 'boolean', example: true },
            value: { type: 'string', example: '12 meses de garantía oficial' }
          },
          description: 'Información de garantía del producto',
        },
        features: {
          type: 'array',
          items: { type: 'string' },
          example: ['Capacidad: 64 GB', 'Incluye 2 controles'],
        },
        slug: {
          type: 'string',
          example: 'iphone-14-pro-max-256gb',
        },
      },
    },
  })
  @ApiOperation({ 
    summary: 'Update a product (requires authentication)',
    description: `
    Actualiza un producto existente. Puede recibir archivos de imagen mediante el campo "images" (hasta 10 archivos, máximo 5MB cada uno).
    
    **Formas de uso:**
    1. **Solo datos:** Actualizar solo campos de texto/número sin cambiar imágenes
    2. **Con archivos:** Subir nuevos archivos usando el campo "images" en multipart/form-data (reemplazarán las imágenes existentes)
    3. **Con URLs:** Enviar nuevas URLs de imágenes en el campo JSON "images" (reemplazarán las imágenes existentes)
    4. **Mixto:** Combinar archivos subidos con URLs
    
    **Nota:** Si se proporcionan nuevas imágenes (archivos o URLs), reemplazarán completamente las imágenes existentes.
    `
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file type or size' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return await this.productsService.update(id, updateProductDto, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'You are not the owner of this product' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.productsService.remove(id, user.id);
    return { message: `Product with ID ${id} has been deleted` };
  }
}
