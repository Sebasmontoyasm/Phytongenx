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

  constructor(private http: HttpClient){ }

  /**
   * 
   * @returns 
   */  
  manually(): Observable<Cms[]>{
      return this.http.get<Cms[]>(`${environment.API_URL}/api/cms`).
      pipe(
        catchError(this.handlerError));
  }

  /**
   * 
   * @returns 
   */
  performace(){
    return this.http.get<CmsPerformance[]>(`${environment.API_URL}/api/cms/performance`).
    pipe(
      catchError(this.handlerError)); 
  }

  detail(id:string){
    return this.http.get<LabResult[]>(`${environment.API_URL}/api/cms/${id}`).
    pipe(
      catchError(this.handlerError));
  }

  upload(fileForm: FormData):Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/api/cms/upload`,fileForm).
    pipe(
      catchError(this.handlerError));
  }

  update(id:number, CmsUpdate:CmsUpdate): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/api/cms/${id}`,CmsUpdate)
    .pipe(
      catchError(this.handlerError),
    );
  }

  checkPDF_Name(PDF_Name:string): Observable<any>{{
    return this.http.get<any>(`${environment.API_URL}/api/cms/pdf/${PDF_Name}`)
    .pipe(
      catchError(this.handlerError),
    );
  }
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

