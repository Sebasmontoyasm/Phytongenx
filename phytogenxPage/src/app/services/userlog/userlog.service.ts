import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class UserlogService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserLog[]>{
    return this.http.get<UserLog[]>(`${environment.API_URL}/userlogs`).
    pipe(
      catchError(this.handlerError));
   }

  new(log: UserLog) {
    return this.http.post<UserLog>(`${environment.API_URL}/userlogs`,log).
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


