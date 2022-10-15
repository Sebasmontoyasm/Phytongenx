import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Data {
    @Column({type:"int", width:11})
    @PrimaryGeneratedColumn('increment')
    ID: number;

    @Column({type:"varchar",length: 100,nullable:true})
    PO_Number: string;

    @Column({type:"varchar",length: 150,nullable:true})
    Date_CSM_Processed: string;

    @Column({type:"varchar",length: 300,nullable:true})
    PDF_Name: string;

    @Column({type:"int", width:11,nullable:true})
    Invoice_Number: number;

    @Column({type:"varchar",length: 150,nullable:true})
    Date_invoice_recieved: string;

    @Column({type:"varchar",length: 150,nullable:true})
    Date_Quickbooks_Processed: string;

    @Column({type:"varchar",length: 300,nullable:true})
    NamePDF: string; 
}