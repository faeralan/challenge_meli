import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersModule } from '../users/users.module';
import { ProductJsonRepository } from './repositories/product-json.repository';

@Module({
  imports: [UsersModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'IProductRepository',
      useClass: ProductJsonRepository,
    },
  ],
})
export class ProductsModule {}
