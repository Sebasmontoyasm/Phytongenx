import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn} from "typeorm"
import { MinLength, IsNotEmpty} from "class-validator";
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    rol: string;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    username: string;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    createdAt: string;

    @Column()
    UpdateAt: string;

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
      }
    
      checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
      }
}
