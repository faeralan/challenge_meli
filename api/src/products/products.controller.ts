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
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
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
  @ApiOperation({ 
    summary: 'Create a new product (requires authentication)',
    description: `Create a new product. It can receive images through the "images" field (up to 10 files, maximum 5MB each).`
  })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductDetailDto })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file type, size, or missing images' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createProductDto: CreateProductDto, 
    @CurrentUser() user: User,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    // Check if there are images (uploaded files or URLs in the DTO)
    if (!files?.length && !createProductDto.images?.length) {
      throw new BadRequestException(
        'You must provide at least one image, either by uploading files or providing URLs in the images field'
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
  @ApiOperation({ summary: 'Update a product (requires authentication)' })
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
