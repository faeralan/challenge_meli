import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

// Configuration for file storage
export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = join(process.cwd(), 'uploads', 'temp');
      
      // Create directory if it does not exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      // Generate unique file name
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Filter only images
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
          'Invalid file type. Only images (jpeg, jpg, png, gif, webp) are allowed'
        ),
        false
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10, // Maximum 10 files
  },
};

// Opciones para archivos múltiples
export const imageUploadOptions = {
  ...multerConfig,
  dest: join(process.cwd(), 'uploads', 'temp'),
}; 