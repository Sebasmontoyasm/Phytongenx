import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Invoices {
    @Column({type:"int", width:11})
    @PrimaryGeneratedColumn('increment')
    ID: number;

    @Column({type:"varchar",length: 200,nullable:true})
    Date: string;

    @Column({type:"varchar",length: 200,nullable:true})
    PONumber: string;

    @Column({type:"varchar",length: 200,nullable:true})
    InvoiceNumber: string;

    @Column({type:"varchar",length: 200,nullable:true})
    State: string;
}