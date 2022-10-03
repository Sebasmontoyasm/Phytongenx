import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserResponse, Roles } from '../interfaces/user';
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
  private rol = new BehaviorSubject<string>('guest');
  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
   }

  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  get isRol():Observable<string>{
    return this.rol.asObservable();
  }

  login(authData: User): Observable<UserResponse | void> {
    return this.http.
    post<UserResponse>(`${environment.API_URL}/auth/singin`,authData, { 'headers': headers })
    .pipe(
      map((res:UserResponse) => {
        this.saveLocalStorange(res);
        this.loggedIn.next(true);
        this.rol.next(res.rol);
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  
  loginout(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.rol.next('guest');
    this.router.navigate(['/homepage']);
  }

  private checkToken(): void {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);
    if(user){
      const isExpired = helper.isTokenExpired(user.token);

      if(isExpired){
        this.loginout();
      }
      else{
        this.loggedIn.next(true);
        this.rol.next(user.rol);
      }
    }
  
  }
  private readToken():void{
    
  }

  private saveLocalStorange(user: UserResponse): void {
    const { id, message, ...rest} = user
    localStorage.setItem('user',JSON.stringify(rest));  
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
