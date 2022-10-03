import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class UserlogService {
  
  url='http://localhost:3000/api/userlogs/';

  constructor(private http: HttpClient) { }

  reportUser(userlog: UserLog): Observable<any>  {
    console.log("ERROR: ",this.http.post<UserLog>(this.url+"post",userlog))
    return this.http.post<any>(this.url+"post",userlog);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}

export interface UserLog{
  user?:number;
  rol?: string;
  action?: string;
  dateaction: string;
  iddata: number;
  idpo: number;
  idinvoce: number;
  comments: string;
}

