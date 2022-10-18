import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RpaService {

  constructor(private http: HttpClient) { }

  report(){
    return this.http.get<any>(`${environment.API_URL}/rpa/status`).
    pipe(
      catchError(this.handlerError));
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
