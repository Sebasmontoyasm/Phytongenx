import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"
import { MinLength, IsNotEmpty} from "class-validator";

@Entity()
export class Userlog {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'int', width:11 })
    @IsNotEmpty()
    idrestore: number;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty()
    username: string;

    @Column({type:"varchar",length: 100})
    @MinLength(2)
    @IsNotEmpty()
    rol: string;

    @Column({type:"varchar"})
    comment: string;

    @Column({type:"varchar",length: 250})
    @IsNotEmpty()
    action: string;

    @Column({ type: 'varchar', length:100})
    @IsNotEmpty()
    date_action: string;
}
