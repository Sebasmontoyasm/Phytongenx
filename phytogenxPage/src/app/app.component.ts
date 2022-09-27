import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { SinginPageComponent } from './components/singin-page/singin-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'PhytonGenX Web Tools';

  constructor(public singin: MatDialog) { }

  ngOnInit(): void {
  }

  closeSingIn(){
    this.singin.closeAll();
  }
  openSingIn(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.singin.open(SinginPageComponent, {
    position: {top: '130px'},
    width: '40%',
    height: '69%',
    
    enterAnimationDuration,
    exitAnimationDuration
  });
  }
}
