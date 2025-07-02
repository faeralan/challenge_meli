import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Configure CORS to allow requests from frontend
  app.enableCors({
    origin: [
      'http://localhost:3001', // Frontend React
      'http://localhost:3000', // Backup
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

   // Configure static files for images
   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
     prefix: '/uploads/',
   });

   const config = new DocumentBuilder()
      .setTitle('Product API')
      .setDescription('Product API RESTful')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API running on: http://localhost:${process.env.PORT ?? 3000}/api`);

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
    app.close().then(() => {
      console.log('✅ Application closed gracefully');
      process.exit(0);
    }).catch((error) => {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    });
  };

  // Escuchar señales de terminación
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}
bootstrap();
