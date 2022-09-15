import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  url='http://localhost:3000/api/cms/';

  constructor(private http: HttpClient){ }
  /**
   * 
   * @returns 
   */  
  manually(){
    return this.http.get(this.url+"manually");
  }
  /**
   * 
   * @returns 
   */
  performace(){
    return this.http.get(this.url+"performance"); 
  }

  detail(id:string){
    console.log("Esto llega del Get: ",this.url+"detail/"+id);
    return this.http.get(this.url+"detail/"+id);
  }


  
}

export interface Cms{
  id?:string;
  po_number?: string;
}

