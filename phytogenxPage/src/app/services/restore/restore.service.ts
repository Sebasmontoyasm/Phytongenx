import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Data } from 'src/app/interfaces/data/data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestoreService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Data[]>{
    return this.http.get<Data[]>(`${environment.API_URL}/api/restore`).
    pipe(
      catchError(this.handlerError));
  }

  save(oldData: Data) {
    return this.http.post<Data>(`${environment.API_URL}/api/restore`,oldData).
    pipe(
      catchError(this.handlerError));
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
