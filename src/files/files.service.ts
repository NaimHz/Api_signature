import { Injectable } from '@nestjs/common';
import {
  HttpStatus,
} from '@nestjs/common';
import { createReadStream, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File)
        private fileRepository: Repository<File>,
      ) {}

  handleFileUpload(body, file: Express.Multer.File) :string {
    
    return JSON.stringify({
        message: `File uploaded successfully: ${file.originalname}`,
      });
  }

  downloadFile(res){
    const files = readdirSync("./uploads");

    if (files.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).send('No files available for download');
    }

    const filename = files[0];
    const filePath = join("./uploads", filename);

    if (!existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).send('File not found');
    }

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);

  }
}
