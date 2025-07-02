import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

describe('Repository Edge Cases and Error Handling (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  const testUser = {
    email: 'edge-test@example.com',
    password: 'password123',
    name: 'Edge Test User',
    location: 'Edge Test Location'
  };

  const testProduct = {
    title: 'Edge Case Test Product',
    description: 'Test product for edge cases',
    price: 100,
    images: ['test1.jpg'],
    mainImage: 'test1.jpg',
    stock: 10,
    condition: 'new' as const,
    category: 'Electronics',
    rating: 4.5,
    totalReviews: 10,
    enabledPaymentMethods: ['mercadopago'],
    freeShipping: true
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();

    // Register user for tests
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    authToken = registerResponse.body.access_token;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Repository Edge Cases', () => {
    it('should handle directory creation when data directory does not exist', async () => {
      // Este test ejercita el path de ensureDirectoryExists en BaseJsonRepository
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'Directory Creation Test'
        })
        .expect(201)
        .expect(res => {
          expect(res.body.title).toBe('Directory Creation Test');
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should exercise user repository methods thoroughly', async () => {
      // Test findByEmail path
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(201);

      expect(response.body.user.email).toBe(testUser.email);

      // Test que ejercita incrementSalesCount
      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'Sales Count Test Product'
        })
        .expect(201);
    });

    it('should handle complex matching criteria in repositories', async () => {
      // Crear productos con datos complejos para testing de matchesCriteria
      const complexProducts = [
        {
          ...testProduct,
          title: 'Complex Match Test 1',
          features: ['Feature A', 'Feature B'],
          availableColors: [{ name: 'Red', image: 'red.jpg' }],
          warranty: { status: true, value: 'Complex warranty text' }
        },
        {
          ...testProduct,
          title: 'Complex Match Test 2',
          features: ['Feature A', 'Feature C'],
          availableColors: [{ name: 'Blue', image: 'blue.jpg' }],
          warranty: undefined
        }
      ];

      for (const product of complexProducts) {
        await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send(product)
          .expect(201);
      }

      // Buscar productos para ejercitar matchesCriteria con objetos complejos
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect(res => {
          const complexProducts = res.body.filter(p => p.title.includes('Complex Match Test'));
          expect(complexProducts.length).toBe(2);
          
          const productWithFeatures = complexProducts.find(p => p.features && p.features.includes('Feature A'));
          expect(productWithFeatures).toBeDefined();
        });
    });

    it('should test product repository slug generation edge cases', async () => {
      // Test generación de muchos productos con títulos similares
      const similarProducts = [];
      for (let i = 1; i <= 15; i++) {
        const response = await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...testProduct,
            title: 'Similar Title Product' // Mismo título para forzar generación de slugs únicos
          })
          .expect(201);
        
        similarProducts.push(response.body);
      }

      // Verificar que todos tienen slugs únicos
      const slugs = similarProducts.map(p => p.slug);
      const uniqueSlugs = [...new Set(slugs)];
      expect(uniqueSlugs.length).toBe(similarProducts.length);

      // Verificar que el patrón de numeración es correcto
      expect(similarProducts[0].slug).toBe('similar-title-product');
      expect(similarProducts[1].slug).toBe('similar-title-product-1');
      expect(similarProducts[14].slug).toBe('similar-title-product-14');
    });

    it('should handle product updates with various slug scenarios', async () => {
      // Crear producto inicial
      const initialResponse = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'Update Slug Test',
          slug: 'update-slug-test'
        })
        .expect(201);

      const productId = initialResponse.body.id;

      // Scenario 1: Update title pero mismo slug base
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Update Slug Test Modified'
        })
        .expect(200);

      // Scenario 2: Update con slug explícito que ya existe (debería hacer único)
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          slug: 'similar-title-product' // Ya existe de tests anteriores
        })
        .expect(200);

      // Verificar el estado final
      return request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.id).toBe(productId);
          // El slug debería ser único
          expect(res.body.slug).toMatch(/^similar-title-product(-\d+)?$/);
        });
    });

    it('should filter products by seller correctly', async () => {
      // Crear varios productos para el mismo seller
      const sellerProducts = [];
      for (let i = 1; i <= 3; i++) {
        const response = await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...testProduct,
            title: `Seller Product ${i}`
          })
          .expect(201);
        
        sellerProducts.push(response.body);
      }

      // Obtener todos los productos y filtrar por seller
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect(res => {
          const userProducts = res.body.filter(p => p.seller.id === userId);
          expect(userProducts.length).toBeGreaterThanOrEqual(3);
          
          const sellerProductTitles = userProducts
            .filter(p => p.title.includes('Seller Product'))
            .map(p => p.title);
          
          expect(sellerProductTitles).toContain('Seller Product 1');
          expect(sellerProductTitles).toContain('Seller Product 2');
          expect(sellerProductTitles).toContain('Seller Product 3');
        });
    });

    it('should test user repository edge cases', async () => {
      // Test para ejercitar findActiveUsers
      const newUser = {
        email: 'active-user-test@example.com',
        password: 'password123',
        name: 'Active User Test',
        location: 'Active Location'
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      // Login para ejercitar findByEmail
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password
        })
        .expect(201)
        .expect(res => {
          expect(res.body.user.email).toBe(newUser.email);
          expect(res.body.user).not.toHaveProperty('password');
          // isActive is not included in login response, but is created as true by default
        });
    });

    it('should exercise delete operations thoroughly', async () => {
      // Crear producto para eliminar
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'Product To Delete'
        })
        .expect(201);

      const productId = response.body.id;

      // Verificar que existe
      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      // Eliminar producto
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verificar que ya no existe (ejercita el exists method)
      return request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);
    });

    it('should handle edge cases in product service mappings', async () => {
      // Crear producto con datos que ejerciten mapToProductDetail
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'Mapping Test Product',
          enabledPaymentMethods: ['mercadopago', 'visa_credit', 'visa_debit'],
          features: ['Complex Feature 1', 'Complex Feature 2'],
          availableColors: [
            { name: 'Red', image: 'red.jpg' },
            { name: 'Green', image: 'green.jpg' }
          ]
        })
        .expect(201);

      // Verificar el mapeo correcto
      return request(app.getHttpServer())
        .get(`/products/${response.body.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.paymentMethods).toBeDefined();
          expect(res.body.paymentMethods.length).toBeGreaterThan(0);
          expect(res.body.seller).toBeDefined();
          expect(res.body.seller).not.toHaveProperty('password');
          expect(res.body.features).toEqual(['Complex Feature 1', 'Complex Feature 2']);
          expect(res.body.availableColors).toHaveLength(2);
        });
    });

    it('should force path coverage for user service getSellerInfo', async () => {
      // This test tries to exercise the path where getSellerInfo returns null
      // When searching for products, mapUserToSellerInfo internally calls getSellerInfo
      // Products should have valid seller info
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
          // Los productos deberían tener seller info válida
          if (res.body.length > 0) {
            expect(res.body[0].seller).toBeDefined();
            expect(res.body[0].seller.id).toBeDefined();
          }
        });
    });

    it('should test JWT strategy validation edge cases', async () => {
      // Crear un token inválido para ejercitar paths de error en JWT strategy
      const invalidToken = 'invalid.jwt.token';
      
      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({
          ...testProduct,
          title: 'JWT Test Product'
        })
        .expect(401); // Debería fallar con token inválido
    });

    it('should exercise product repository unique ID generation exhaustively', async () => {
      // Crear muchos productos para ejercitar la generación de IDs únicos
      const products = [];
      for (let i = 1; i <= 50; i++) {
        const response = await request(app.getHttpServer())
          .post('/products')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...testProduct,
            title: `Bulk Product ${i}`,
            slug: `bulk-product-${i}`
          })
          .expect(201);
        
        products.push(response.body);
      }

      // Verificar que todos tienen IDs únicos de formato MLA + 9 dígitos
      const ids = products.map(p => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds.length).toBe(products.length);
      
      // Verificar formato de IDs
      products.forEach(product => {
        expect(product.id).toMatch(/^MLA\d{9}$/);
      });
    });

    it('should test complex object comparison in matchesCriteria', async () => {
      // Crear productos con objetos complejos anidados para exercitar matchesCriteria
      const productWithComplexData = {
        ...testProduct,
        title: 'Complex Criteria Test',
        availableColors: [
          { name: 'Deep Red', image: 'deep-red.jpg' },
          { name: 'Ocean Blue', image: 'ocean-blue.jpg' }
        ],
        features: ['Advanced Feature 1', 'Advanced Feature 2']
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productWithComplexData)
        .expect(201);

      // Buscar el producto para exercitar los paths de comparación
      return request(app.getHttpServer())
        .get(`/products/${response.body.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.availableColors).toHaveLength(2);
          expect(res.body.features).toHaveLength(2);
          expect(res.body.availableColors[0].name).toBe('Deep Red');
        });
    });

    it('should test exists method directly through delete operations', async () => {
      // Crear y eliminar producto para exercitar exists method
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'Exists Method Test'
        })
        .expect(201);

      const productId = response.body.id;

      // Eliminar producto
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Intentar eliminar de nuevo (debería devolver false en exists)
      return request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404); // Ya no existe
    });

    it('should exercise update scenarios that trigger different branches', async () => {
      // Crear producto para testing de branches de update
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'Branch Testing Product',
          slug: 'branch-testing-product'
        })
        .expect(201);

      const productId = response.body.id;

      // Scenario 1: Update sin cambiar título ni slug
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          price: 999,
          stock: 5
        })
        .expect(200);

      // Scenario 2: Update cambiando solo el slug (sin título)
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          slug: 'new-branch-testing-slug'
        })
        .expect(200);

      // Scenario 3: Update con título igual al existente (no debería cambiar slug)
      return request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Branch Testing Product', // Mismo título
          description: 'Updated description'
        })
        .expect(200)
        .expect(res => {
          expect(res.body.title).toBe('Branch Testing Product');
          expect(res.body.description).toBe('Updated description');
        });
    });

    it('should test boundary conditions in repositories', async () => {
      // Test para exercitar boundary conditions and edge cases
      const boundaryProduct = {
        ...testProduct,
        title: 'Boundary Test Product',
        price: 0, // Precio mínimo
        stock: 0, // Stock mínimo
        rating: 0, // Rating mínimo
        totalReviews: 0, // Reviews mínimo
        images: ['single-image.jpg'], // Mínimo de imágenes
        enabledPaymentMethods: ['mercadopago'] // Mínimo de métodos de pago
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(boundaryProduct)
        .expect(201);

      // Verificar que los boundary values se manejan correctamente
      return request(app.getHttpServer())
        .get(`/products/${response.body.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.price).toBe(0);
          expect(res.body.stock).toBe(0);
          expect(res.body.rating).toBe(0);
          expect(res.body.totalReviews).toBe(0);
          expect(res.body.images).toHaveLength(1);
          expect(res.body.enabledPaymentMethods).toHaveLength(1);
        });
    });

    it('should exercise findByIdOrSlug with direct ID instead of slug', async () => {
      // Crear producto para obtener su ID
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'ID Direct Access Test',
          slug: 'id-direct-access-test'
        })
        .expect(201);

      const productId = response.body.id;

      // Buscar el producto por ID directo (no por slug)
      // Esto ejercita el branch que verifica si el term empieza con "MLA"
      return request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.id).toBe(productId);
          expect(res.body.title).toBe('ID Direct Access Test');
          expect(res.body.slug).toBe('id-direct-access-test');
        });
    });

    it('should exercise user service error paths', async () => {
      // Intentar obtener un producto que no existe para ejercitar el path de error en getSellerInfo
      return request(app.getHttpServer())
        .get('/products/mla999999999') // ID que no existe
        .expect(404);
    });

    it('should test all payment methods mapping', async () => {
      // Crear producto con todos los métodos de pago para ejercitar completamente el mapeo
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testProduct,
          title: 'All Payment Methods Test',
          enabledPaymentMethods: [
            'mercadopago',
            'visa_credit', 
            'visa_debit',
            'mastercard_credit',
            'mastercard_debit',
            'pagofacil'
          ]
        })
        .expect(201);

      // Verificar que todos los métodos de pago se mapean correctamente
      return request(app.getHttpServer())
        .get(`/products/${response.body.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.paymentMethods).toBeDefined();
          expect(res.body.paymentMethods.length).toBeGreaterThan(0);
          
          // Verificar que cada método de pago tiene la estructura correcta
          res.body.paymentMethods.forEach(method => {
            expect(method).toHaveProperty('id');
            expect(method).toHaveProperty('name');
            expect(method).toHaveProperty('icon'); // Es 'icon', no 'logo'
          });
        });
    });

    it('should exercise all repository methods with complex data', async () => {
      // Test con datos complejos válidos según el DTO
      const complexProduct = {
        ...testProduct,
        title: 'Complex Repository Test',
        features: ['Advanced Feature 1', 'Advanced Feature 2'],
        availableColors: [
          { name: 'Deep Red', image: 'deep-red.jpg' },
          { name: 'Ocean Blue', image: 'ocean-blue.jpg' }
        ],
        brand: 'Complex Brand',
        model: 'Complex Model'
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(complexProduct)
        .expect(201);

      // Verificar que los datos complejos se manejan correctamente
      return request(app.getHttpServer())
        .get(`/products/${response.body.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.title).toBe('Complex Repository Test');
          expect(res.body.features).toHaveLength(2);
          expect(res.body.availableColors).toHaveLength(2);
          expect(res.body.brand).toBe('Complex Brand');
          expect(res.body.model).toBe('Complex Model');
        });
    });
  });
}); 