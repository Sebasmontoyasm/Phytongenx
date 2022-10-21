import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Labresults {
    @Column({type:"int", width:11})
    @PrimaryGeneratedColumn('increment')
    ID: number;

    @Column({type:"varchar",length: 300,nullable:true})
    Code: string;

    @Column({type:"varchar",length: 300,nullable:true})
    Date: string;

    @Column({type:"varchar",length: 300,nullable:true})
    PDFName: string;

    @Column({type:"varchar",length: 300,nullable:true})
    PONumber: string;

    @Column({type:"varchar",length: 300,nullable:true})
    SubloteCode: string;
    
    @Column({type:"varchar",length: 300,nullable:true})
    Test: string;

    @Column({type:"varchar",length: 100,nullable:true})
    State: string;
}