import { Column, PrimaryGeneratedColumn } from "typeorm";

export class File {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    size: number;

    @Column()
    path: string;

    @Column({ default: 0 })
    checkCount: number;
}
