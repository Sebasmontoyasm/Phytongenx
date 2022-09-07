import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  url='http://localhost:3000/cms';
  constructor(private http: HttpClient){ }
    
  getUpdatecms(){
    return this.http.get(this.url+'/'+"manually");
  }
}


export interface Cms{
  id?:string;
  po_number?: string;
}

