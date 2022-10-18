/**
 * MasterData for MasterData View Page
 * ID number,
 * PO_Number string,
 * Date_CSM_Processed string,
 * NamePDF string,
 * Invoice_Number number,
 * Date_Quickbooks_Processed string,
 * Date_invoice_recieved string,
 * NamePDF string
 **/

 export interface MasterData{
    ID:number,
    PO_Number: string,
    Date_CSM_Processed: string,
    PDF_Name: string,
    Invoice_Number: string
    Date_invoice_recieved: string,
    Date_Quickbooks_Processed: string,
    NamePDF: string,
    DaysSince: number,
    DelayQb: number,
    InvoiceObj: string,
    PO_NumberObj: string,
    IDObject: string,
    comment: string
  }

  export interface Data{
    ID?:number,
    PO_Number?: string,
    Date_CSM_Processed?: string,
    PDF_Name?: string,
    Invoice_Number?: number,
    Date_invoice_recieved?: string,
    Date_Quickbooks_Processed?: string,
    NamePDF?: string
  }

  export interface DataCreate{
    PO_Number?: string;
    Date_CSM_Processed?: string;
    PDF_Name?: string;
    Date_Quickbooks_Processed?:string;
  }