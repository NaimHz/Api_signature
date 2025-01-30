import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import * as path from 'path';
import { exiftool } from 'exiftool-vendored';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { UUID } from 'crypto';

@Injectable()
export class FilesService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');
  private readonly jwtSecret = process.env.JWT_SECRET_CODE;

  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService  // Injection du UsersService
  ) {}

  async cryptUpload(body: CreateFileDto, file: Express.Multer.File, res, req) {
    if (!file || !file.path) {
      throw new Error('Le fichier est vide ou non valide.');
    }
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    let userHeader = jwt.verify(token, this.jwtSecret) as { id: UUID; email: string; iat: number; exp: number };

    const user = await this.usersService.findOneById(userHeader.id);

    const encryptedCode = jwt.sign({ code: body.code }, this.jwtSecret, {
      expiresIn: '1h',
    });

    try {
      const filePath = path.join(this.uploadPath, file.filename);
      const outputFilePath = path.join(
        this.uploadPath,
        `encrypted_${file.filename}`,
      );

      await exiftool.write(
        filePath,
        {
          Title: encryptedCode,
        },
        ['-o', outputFilePath],
      );

      console.log('Métadonnées ajoutées avec succès');

      const newFile = this.fileRepository.create({
        size: file.size,
        path: filePath,
        user: user
      });

      await this.fileRepository.save(newFile);
      console.log('Fichier enregistré en base:', newFile);

      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);

      return `Fichier uploadé avec succès : ${file.filename}`;
    } catch (error) {
      throw new Error("Erreur lors de l'ajout des métadonnées.");
    }
  }

  async decryptUpload(
    file: Express.Multer.File,
  ): Promise<{ decryptedCode: string }> {
    if (!file || !file.path) {
      console.error('Le fichier est vide ou non valide.');
      throw new Error('Le fichier est vide ou non valide.');
    }

    try {
      console.log(`Lecture des métadonnées du fichier: ${file.path}`);
      const metadata = await exiftool.read(file.path);
      console.log('Métadonnées récupérées:', metadata);

      if (!metadata.Title) {
        throw new Error('Aucun code crypté trouvé dans les métadonnées.');
      }

      const encryptedCode = metadata.Title;

      if (!this.jwtSecret) {
        throw new Error('La clé secrète JWT_SECRET_CODE est indéfinie.');
      }

      try {
        const decodedToken = jwt.verify(encryptedCode, this.jwtSecret) as {
          code: string;
        };
        console.log('Token décodé:', decodedToken);
        return { decryptedCode: decodedToken.code };
      } catch (jwtError) {
        if (jwtError instanceof jwt.JsonWebTokenError) {
        }
        throw new Error('Token invalide ou expiré');
      }
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération du code : ${error.message}`,
      );
    }
  }
}
