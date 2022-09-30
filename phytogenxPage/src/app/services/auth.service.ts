import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserResponse } from '../interfaces/user';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();

const headers= new HttpHeaders();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', 'http://localhost:3001');
headers.append('Access-Control-Allow-Methods','GET,HEAD,OPTIONS,POST,PUT');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
   }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  login(authData: User): Observable<UserResponse | void> {
    return this.http.
    post<UserResponse>(`${environment.API_URL}/auth/singin`,authData, { 'headers': headers })
    .pipe(
      map((res:UserResponse) => {
        this.saveToken(res.token);
        this.loggedIn.next(true);
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  
  loginout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/homepage']);
  }

  private checkToken(): void {
    const userToken: any = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(userToken);

      if(isExpired){
        this.loginout();
      }
      else{
        this.loggedIn.next(true);
      }
      console.log("LOGGED STATUS: ",this.loggedIn.value)
  }
  private readToken():void{
    
  }

  private saveToken(token: string): void {
    localStorage.setItem('token',token);  
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
