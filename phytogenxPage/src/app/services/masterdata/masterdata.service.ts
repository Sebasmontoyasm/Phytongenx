import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Data, DataCreate } from 'src/app/interfaces/data/data';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  url='http://localhost:3000/api/data/';

  constructor(private http: HttpClient) { }

  getMasterData(){
    return this.http.get<Data>(`${environment.API_URL}/masterdata`).
    pipe(
      catchError(this.handlerError)
    );
  }

  getById(id:number): Observable<Data>{
    return this.http.get<Data>(`${environment.API_URL}/masterdata/${id}`).
    pipe(
      catchError(this.handlerError)
    );
   } 

  lastData(): Observable<Data> {
    return this.http.get<Data>(`${environment.API_URL}/masterdata/last`).
    pipe(
      catchError(this.handlerError)
    );
  }  

  new(dataCreate: DataCreate): Observable<any>{
    return this.http.post<DataCreate>(`${environment.API_URL}/masterdata`,dataCreate).
    pipe(
      catchError(this.handlerError));
  }
       
  deleteById(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/masterdata/${id}`).
    pipe(
      catchError(this.handlerError),
    );
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

