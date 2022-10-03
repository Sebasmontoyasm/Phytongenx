import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


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

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    console.log("File: "+file);
    console.log("form: ",formData);

    this.http.post(this.url+"upload",formData);

    const req = new HttpRequest('POST', `${this.url}upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.url}files`);
  }

  
}

export interface Cms{
  id?:string;
  po_number?: string;
}

