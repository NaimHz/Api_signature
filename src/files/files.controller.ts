import { FilesService } from './files.service';
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { createReadStream, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateFileDto } from './dto/create-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('download')
  downloadFile(@Res() res: Response) {
    return this.filesService.downloadFile(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Body() uploadBody : CreateFileDto, @UploadedFile() file: Express.Multer.File) {
    return this.filesService.handleFileUpload(uploadBody, file);
  }
}
