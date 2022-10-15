import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError} from 'rxjs/operators';
import { Cms, CmsUpdate,CmsCreate } from 'src/app/interfaces/cms/cms';


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
  manually(){
    return this.http.get(this.url+"manually");
  }
  /**
   * 
   * @returns 
   */
  performace(){
    return this.http.get(this.url+"performance"); 
  }

  detail(id:string){
    return this.http.get(this.url+"detail/"+id);
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
  update(id:number, CmsUpdate:CmsUpdate): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/masterdata/cms/${id}`,CmsUpdate)
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

  getFiles(): Observable<any> {
    return this.http.get(`${this.url}files`);
  }

  new(cmsCreate: CmsCreate): Observable<any>{
    return this.http.post<any>(`${environment.API_URL}/masterdata/cms`,cmsCreate).
    pipe(
      catchError(this.handlerError));
   }
  
}

