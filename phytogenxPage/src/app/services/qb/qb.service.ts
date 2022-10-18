import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { QbUpdate } from 'src/app/interfaces/qb/qb';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QbService {

  url='http://localhost:3000/api/qb/';

  constructor(private http: HttpClient){ }
    
  performace(){
    return this.http.get(this.url+"performance"); 
  }
  
  detail(id: string){
    return this.http.get(this.url+"detail/"+id); 
  }

  get(){
    return this.http.get(`${environment.API_URL}/qb`);   
  }

  update(id:number, qbUpdate:QbUpdate): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/qb/${id}`,qbUpdate)
    .pipe(
      catchError(this.handlerError)
    );
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

  private handlerError(err:any): Observable<never> {
    let errorMessage = 'An error occurred retrienving data';
    if(err){
      errorMessage= `Error: code ${err.message}`
    }
    window.alert(errorMessage)  
    return throwError(errorMessage);
  }
}
