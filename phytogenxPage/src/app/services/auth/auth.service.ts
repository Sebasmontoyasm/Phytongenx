import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserResponse} from '../../interfaces/user/user';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();
const headers= new HttpHeaders();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', '*');
headers.append('Access-Control-Allow-Methods','*');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string>('');
  private rol = new BehaviorSubject<string>('guest');
  private userToken = new BehaviorSubject<string>('');
  
  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
   }

  get isLogged():Observable<boolean>{
    if(this.loggedIn.value == false){
      this.router.navigate(['/homepage']);
    }
    return this.loggedIn.asObservable();
  }

  get isUsername():Observable<string>{
    return this.username.asObservable();
  }
  get isRol():Observable<string>{
    return this.rol.asObservable();
  }

  get userTokenValue(): string {
    return this.userToken.getValue();
  }

  login(authData: User): Observable<UserResponse | void> {
    return this.http.
    post<UserResponse>(`${environment.API_URL}/api/auth/singin`,authData, { 'headers': headers })
    .pipe(
      map((userReponse:UserResponse) => {
        this.saveLocalStorange(userReponse);
        this.loggedIn.next(true);
        this.username.next(userReponse.token);
        this.rol.next(userReponse.rol);
        this.userToken.next(userReponse.token);
        return userReponse;
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  
  loginout(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.username.next('');
    this.rol.next('guest');
    this.userToken.next('');
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
        this.userToken.next(user.token);
      }
    }
  
  }

  private saveLocalStorange(user: UserResponse): void {
    const { id, message, ...rest} = user
    localStorage.setItem('user',JSON.stringify(rest));  
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
