import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde el frontend
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

   const config = new DocumentBuilder()
      .setTitle('Product API')
      .setDescription('Product API RESTful')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API corriendo en: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
