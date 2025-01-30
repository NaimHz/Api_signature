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
  UseGuards,
  Request,
} from '@nestjs/common';
import { createReadStream, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateFileDto } from './dto/create-file.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('crypt')
  @UseInterceptors(FileInterceptor('file'))
  cryptUpload(
    @Body() uploadBody: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Request() req: Request,
  ) {
    return this.filesService.cryptUpload(uploadBody, file, res, req);
  }

  @Post('decrypt')
  @UseInterceptors(FileInterceptor('file'))
  decryptUpload(
    @Body() uploadBody: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.decryptUpload(file);
  }
}
