import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class AdministratorInterceptor implements HttpInterceptor{
    constructor(private authService:AuthService){}
    intercept(req:HttpRequest<any>, next: HttpHandler):Observable<any> {
        if(req.url.includes('auth')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        }
        else if(req.url.includes('users')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        }else if(req.url.includes('masterdata')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        }
        else if(req.url.includes('cms')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        }else if(req.url.includes('qb')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        }else if(req.url.includes('userlogs')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        }else if(req.url.includes('restore')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        }else if(req.url.includes('rpa')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            
            return next.handle(authReq);
        }
        else if(req.url.includes('metric')){
            const authToken = this.authService.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            
            return next.handle(authReq);
        }
        return next.handle(req);
    }
        
}

