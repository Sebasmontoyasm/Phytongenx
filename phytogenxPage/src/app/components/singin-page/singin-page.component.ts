import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../interfaces/user/user';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-singin-page',
  templateUrl: './singin-page.component.html',
  styleUrls: ['./singin-page.component.css']
})
export class SinginPageComponent implements OnInit, OnDestroy {
  hide = false;
  private isValidusername = /\S+\.\S+/;
  private destroy = new Subject<any>();


  singInForm: FormBuilder | any  = this.fb.group({
    username: ['',[Validators.required,Validators.pattern(this.isValidusername)]],
    password: ['',[Validators.required, Validators.minLength(6)]],
    UpdateAt: []
  });

  constructor(private authService: AuthService,
              private fb:FormBuilder,
              private router: Router,
              private singin: MatDialog,
              ) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getErrorMessage(field: string): string{
    let message:string = "";

    if(this.singInForm.get(field).hasError('required')){ 
      message = 'You must enter a value.';
    }else if(this.singInForm.get(field).hasError('pattern')){
      message = 'Not a valid username.';
    }else if(this.singInForm.get(field).hasError('minlength')){
      message = 'This field must be longer.';
    }
    return message;
    
  }

  isValidField(field: string):boolean{
    return this.singInForm.get(field).touched || this.singInForm.get(field).dirty && !this.singInForm.get(field).valid;
  }
  onSingin(): void{
    if(this.singInForm.invalid){
      return;
    }
    
    const formValue: User | any = this.singInForm.value;

    let format: string = 'MM/dd/yyyy HH:mm:ss';
    let date: Date = new Date();
    let datepipe = new DatePipe('en-US').transform(date, format);
  
    formValue.UpdateAt = datepipe;

    this.authService.login(formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        this.router.navigate(['']);
        this.closeSingIn();
      }

    });
  }

  closeSingIn(): void{
      this.singin.closeAll();
  }

}
