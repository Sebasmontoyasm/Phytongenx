import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckRolGuard implements CanActivate {
  constructor(private router: Router){}

  canActivate(activeRouter: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean{
    return this.checkRol(state);
  }
  checkRol(state: RouterStateSnapshot):boolean{
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    var regexp: RegExp = /cms\S?/;
    if(state.url.match(regexp) && (user.rol == 'administrator' || user.rol == 'cms' || user.rol == 'cmsandqb')){
      return true;
    }

    regexp = /qb\S?/;
    if(state.url.match(regexp) && (user.rol == 'administrator' || user.rol == 'qb' || user.rol == 'cmsandqb')){
      return true;
    }

    regexp = /user\S?/;
    if(state.url.match(regexp) && (user.rol == 'administrator')){
      return true;
    }

    regexp = /userlogs\S?/;
    if(state.url.match(regexp) && (user.rol == 'administrator')){
      return true;
    }

    regexp = /restore\S?/;
    if(state.url.match(regexp) && (user.rol == 'administrator')){
      return true;
    }

    regexp = /masterdata\S?/;
    if(state.url.match(regexp)){
      return true;
    }

    regexp = /dashboard\S?/;
    if(state.url.match(regexp)){
      return true;
    }

    this.router.navigate(['/homepage']);
    return false;
  }
}
