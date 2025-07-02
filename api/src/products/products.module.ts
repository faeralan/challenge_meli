import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersModule } from '../users/users.module';
import { ProductJsonRepository } from './repositories/product-json.repository';
import { ProductsCacheService } from './services/products-cache.service';
import { RedisConnectionService } from './services/redis-connection.service';

@Module({
  imports: [UsersModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsCacheService,
    RedisConnectionService,
    {
      provide: 'IProductRepository',
      useClass: ProductJsonRepository,
    },
  ],
})
export class ProductsModule {}
