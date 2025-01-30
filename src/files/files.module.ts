import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File, User]),
    UsersModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),

      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/gif',
          'image/webp',
        ];
        const allowedExtensions = ['.png', '.jpeg', '.jpg', '.gif', '.webp'];

        const fileExt = extname(file.originalname).toLowerCase();

        if (
          allowedMimeTypes.includes(file.mimetype) &&
          allowedExtensions.includes(fileExt)
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, ],
  exports: [TypeOrmModule, FilesService]
})
export class FilesModule {}
