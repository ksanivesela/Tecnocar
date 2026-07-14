import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function productosMulterOptions(uploadsDir: string) {
  const destination = join(process.cwd(), uploadsDir, 'productos');

  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination,
      filename: (_req, file, callback) => {
        callback(null, `${randomUUID()}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (_req: unknown, file: Express.Multer.File, callback: (error: Error | null, accept: boolean) => void) => {
      if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
        callback(new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP'), false);
        return;
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  };
}
