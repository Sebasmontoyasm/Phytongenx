import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { QbUpdate } from 'src/app/interfaces/qb/qb';
import { QbDetail } from 'src/app/interfaces/qb/qb-detail';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QbPerformance } from 'src/app/interfaces/qb/qb-performance';

@Injectable({
  providedIn: 'root'
})
export class QbService {

  constructor(private http: HttpClient){ }
    
  performace(){
    return this.http.get<QbPerformance>(`${environment.API_URL}/api/qb/performance`); 
  }
  
  detail(invoice: string){
    return this.http.get<QbDetail>(`${environment.API_URL}/api/qb/${invoice}`)
    .pipe(
      catchError(this.handlerError)
    );
  }

  get(){
    return this.http.get(`${environment.API_URL}/api/qb`);   
  }

  update(id:number, qbUpdate:QbUpdate): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/api/qb/${id}`,qbUpdate)
    .pipe(
      catchError(this.handlerError)
    );
  }

  upload(fileForm: FormData): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/api/qb/upload`,fileForm).
    pipe(
      catchError(this.handlerError));
  }

  checkNamePDF(NamePDF:string){
    return this.http.get<any>(`${environment.API_URL}/api/qb/pdf/${NamePDF}`)
    .pipe(
      catchError(this.handlerError),
    );
  }

  private handlerError(err:any): Observable<never> {
    let status: string[] = ['999','Uknow error'];
    if(err){
      status[0] = err.status;
      status[1] = err.error.message;
    }
    return throwError(status);
  }
}
