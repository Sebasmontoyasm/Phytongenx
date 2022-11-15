 import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChangePass, User } from 'src/app/interfaces/user/user';
import { environment } from 'src/environments/environment';
import { AlertcodesService } from '../alerts/alertcodes.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,
    public alert: AlertcodesService) {
               
   }

   getAll(): Observable<User[]>{
    return this.http.get<User[]>(`${environment.API_URL}/api/users`).
    pipe(
      catchError(this.handlerError));
   }

   getById(id:number): Observable<User>{
    return this.http.get<User>(`${environment.API_URL}/api/users/${id}`).
    pipe(
      catchError(this.handlerError));
   }

   new(user: User): Observable<any>{
    return this.http.post<User>(`${environment.API_URL}/api/users`,user).
    pipe(
      catchError(this.handlerError));
   }

   update(id: number, user:User): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/api/users/${id}`,user).
    pipe(
      catchError(this.handlerError));
   }

   changePassword(id:number,changePass: ChangePass){
    return this.http.patch<any>(`${environment.API_URL}/api/users/changePassword/${id}`,changePass).
    pipe(
      catchError(this.handlerError));
   }

   delete(id: number): Observable<{}>{
    let response = this.http.delete<User>(`${environment.API_URL}/api/users/${id}`) .pipe(
      catchError(this.handlerError));
    
    response.subscribe(res =>{
      let message:string[] = Object.values(res)
      this.alert.alertMessage('201',message[0]);
    },error => {
      this.alert.alertMessage(error[0],error[1]);
    })
    return response;
   
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
