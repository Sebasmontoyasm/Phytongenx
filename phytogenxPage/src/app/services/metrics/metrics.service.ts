import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(private http: HttpClient) { }

  getCMSFound(){
    return this.http.get(`${environment.API_URL}/api/metric/po_found`).
    pipe(
      catchError(this.handlerError)
    );
  }

  getCMSLoaded(){
    return this.http.get(`${environment.API_URL}/api/metric/po_loaded`).
    pipe(
      catchError(this.handlerError)
    );
  }

  getQbFound(){
    return this.http.get(`${environment.API_URL}/api/metric/Invoice_found`).
    pipe(
      catchError(this.handlerError)
    );
  }

  getQbLoaded(){
    return this.http.get(`${environment.API_URL}/api/metric/invoice_loader`).
    pipe(
      catchError(this.handlerError)
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
