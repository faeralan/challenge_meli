import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDetailDto } from './dto/product-detail.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
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
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: `Product with ID ${id} has been deleted` };
  }
}
