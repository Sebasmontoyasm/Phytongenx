import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SigninPageComponent } from '../../signin-page/signin-page.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  rol = "guest";
  isLogged = false;

  private destroy = new Subject<any>();

  constructor(public singin: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLogged.pipe(
      takeUntil(this.destroy)
    ).subscribe((res) => (this.isLogged = res));
    this.authService.isRol.pipe(
      takeUntil(this.destroy)
    ).
      subscribe((res) => (this.rol = res));
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  onSinginout(): void{
    this.authService.loginout();
  }

  closeSingIn(){
    this.singin.closeAll();
  }
  openSingIn(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.singin.open(SigninPageComponent, {
    position: {top: '130px'},
    width: '30%',
    height: '60%',
    enterAnimationDuration,
    exitAnimationDuration
  });
  }
}
