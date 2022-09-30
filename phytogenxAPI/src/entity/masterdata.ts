import { IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm"

@Entity()
@Unique(['ID'])
export class Masterdata {
    @PrimaryGeneratedColumn('increment')
    ID: number;

    @IsNotEmpty()
    @Column()
    PO_Number: string;

    @Column()
    Date_CMS_Processed: string;

    @Column()
    PDF_Name: string;

    @Column()
    Invoice_Number: number;

    @Column()
    Date_invoice_recieved: string;

    @Column()
    Date_Quickbooks_Processed: string;

    @Column()
    NamePDF: string;

    @Column()
    DelayQb: number;

    @Column()
    Dayssince: number;
}
