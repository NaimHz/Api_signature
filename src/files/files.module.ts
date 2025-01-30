import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports:[
    MulterModule.register({
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype === 'image/png') {
            cb(null, true); // ✅ Accepter le fichier
          } else {
            cb(new Error('Only PNG files are allowed!'), false);
          }
        }
      }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
