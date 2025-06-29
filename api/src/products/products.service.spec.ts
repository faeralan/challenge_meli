import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { UsersService } from '../users/users.service';
import { IProductRepository } from './repositories/product.repository.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: jest.Mocked<IProductRepository>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    // Create mocks
    const mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByIdOrSlug: jest.fn(),
      isSlugUnique: jest.fn(),
      findBySellerId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      findBy: jest.fn(),
      findOneBy: jest.fn(),
    };

    const mockUsersService = {
      incrementSalesCount: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      getSellerInfo: jest.fn(),
      findAllActive: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get('IProductRepository');
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have access to product repository', () => {
    expect(productRepository).toBeDefined();
  });

  it('should have access to users service', () => {
    expect(usersService).toBeDefined();
  });
});
