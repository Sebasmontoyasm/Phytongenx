import { Entity, PrimaryColumn} from "typeorm";

@Entity()
export class observablepedro {
    @PrimaryColumn()
    STATUS: number;
}