import { UUID } from 'crypto';
import { File } from 'src/files/entities/file.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: UUID;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => File, (file) => file.id)
    id_file: File[]
}
