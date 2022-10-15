import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get(`${environment.API_URL}/masterdata/qb`);   
  }

  update(id:number, qbUpdate:QbUpdate): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/masterdata/qb/${id}`,qbUpdate)
    .pipe(
      catchError(this.handlerError)
    );
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
