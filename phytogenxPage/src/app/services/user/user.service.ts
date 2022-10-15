 import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
   }

   getAll(): Observable<User[]>{
    return this.http.get<User[]>(`${environment.API_URL}/users`).
    pipe(
      catchError(this.handlerError));
   }

   getById(id:number): Observable<User>{
    return this.http.get<User>(`${environment.API_URL}/users/${id}`).
    pipe(
      catchError(this.handlerError));
   }

   new(user: User): Observable<any>{
    return this.http.post<User>(`${environment.API_URL}/users`,user).
    pipe(
      catchError(this.handlerError));
   }

   update(id: number, user:User): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/users/${id}`,user).
    pipe(
      catchError(this.handlerError));
   }

   delete(id: number): Observable<{}>{
    return this.http.delete<User>(`${environment.API_URL}/users/${id}`)
    .pipe(
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
