import { FilesService } from './files.service';
import {
  Controller,
  Get,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateFileDto } from './dto/create-file.dto';
import { Public } from '../auth/decorators/public.decorator';


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
  @Public()
  @Post('decrypt')
  @UseInterceptors(FileInterceptor('file'))
  decryptUpload(
    @Body() uploadBody: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.decryptUpload(file);
  }

  @Get()
  async getAllFiles() {
    return this.filesService.findAll();
  }
}
