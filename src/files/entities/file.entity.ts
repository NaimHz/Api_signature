import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/users.entity";

@Entity() // Ajout du décorateur Entity
export class File {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    size: number;

    @Column()
    path: string;

    @Column({ default: 0 })
    checkCount: number;

    @ManyToOne(() => User, (user) => user.id, { nullable: false })
    user?: User;
}

