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

 export interface Data{
    id:number;
    po_number?: string;
    dateCSM?: string;
    namePO?: string;
    invoice?: string;
    dateQP?: string;
    dateInv?: string;
    PDA_pdf?: string;
    invoceObj?: number;
    po_numberObj?:string;
    idObj?: number;
    comments?: string;
  }