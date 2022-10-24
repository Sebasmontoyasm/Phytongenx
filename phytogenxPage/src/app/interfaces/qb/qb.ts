export interface Qb {
    ID:number;
    PO_Number: string;
    Invoice_Number: number;
    Date_invoice_recieved: string;
    Date_Quickbooks_Processed: string;
    NamePDF: string;
}

export interface QbUpdate{
    Invoice_Number: number,
    NamePDF: string,
    Date_invoice_recieved: string,
}
