import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError} from 'rxjs/operators';
import { Cms, CmsUpdate} from 'src/app/interfaces/cms/cms';
import { CmsPerformance } from 'src/app/interfaces/cms/cms-performance';
import { LabResult } from 'src/app/interfaces/cms/cms-labresult';


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
  manually(): Observable<Cms[]>{
      return this.http.get<Cms[]>(`${environment.API_URL}/cms`).
      pipe(
        catchError(this.handlerError));
  }

  /**
   * 
   * @returns 
   */
  performace(){
    return this.http.get<CmsPerformance[]>(`${environment.API_URL}/cms/performance`).
    pipe(
      catchError(this.handlerError)); 
  }

  detail(id:string){
    return this.http.get<LabResult[]>(`${environment.API_URL}/cms/${id}`).
    pipe(
      catchError(this.handlerError));
  }

  upload(file: File): Observable<HttpEvent<any>> {
    //Falta
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

  update(id:number, CmsUpdate:CmsUpdate): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/cms/${id}`,CmsUpdate)
    .pipe(
      catchError(this.handlerError),
    );
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.url}files`);
  }

  private handlerError(err:any): Observable<never> {
    let errorMessage = 'An error occurred retrienving data';
    if(err){
      errorMessage= `Error: code ${err.message}`
    }
    window.alert(errorMessage);  
    return throwError(errorMessage);
  }

}

