import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  // Ojo se debe cambiar
  errorMessage = ""
  status: any
  url='http://localhost:3000/api/data/';

  

  constructor(private http: HttpClient) { }

  getMasterData(){
    return this.http.get(this.url);
  }

  getMasterDataID(id:string){
    return this.http.get(this.url+id);
  }

  addData(pedro:any){
    return this.http.post(this.url,pedro);
  }

  deleteDataID(id: number): Observable<any>  {
    return this.http.get(this.url+"delete/"+id);
  }

  dataDeleteBackup(id: number){
    return this.http.get(this.url+"data_delete/"+id);
  }
}
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

export interface data{
  id?:string;
  po_number?: string;
  dateCSM?: string;
  namePO?: string;
  invoice?: string;
  dateQP: string;
  dateInv: string;
  PDA_pdf?: string;
}
