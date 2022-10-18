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
    return this.http.get<Data[]>(`${environment.API_URL}/restore`).
    pipe(
      catchError(this.handlerError));
  }

  save(oldData: Data) {
    return this.http.post<Data>(`${environment.API_URL}/restore`,oldData).
    pipe(
      catchError(this.handlerError));
   }  
  

  handlerError(error: any): Observable<never>{
      let errorMessage = 'Error unknown';
      if(error){
        errorMessage = 'Error'+error.message;
      }

      window.alert(errorMessage);
      return throwError(errorMessage);
  }
}
