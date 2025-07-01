import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

// Configuración para el almacenamiento de archivos
export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = join(process.cwd(), 'uploads', 'temp');
      
      // Crear directorio si no existe
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      // Generar nombre único para el archivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Filtrar solo imágenes
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          'Tipo de archivo no válido. Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por archivo
    files: 10, // Máximo 10 archivos
  },
};

// Opciones para archivos múltiples
export const imageUploadOptions = {
  ...multerConfig,
  dest: join(process.cwd(), 'uploads', 'temp'),
}; 