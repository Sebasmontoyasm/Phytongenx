import { Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../interfaces/user/user';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent implements OnInit, OnDestroy {
  hide = false;
  private isValidusername = /\S+\.\S+/;
  private destroy = new Subject<any>();

  APIMessages: string = '';

  signInForm: FormBuilder | any  = this.fb.group({
    username: ['',[Validators.required,Validators.pattern(this.isValidusername)]],
    password: ['',[Validators.required, Validators.minLength(6)]],
    UpdateAt: []
  });

  constructor(private authService: AuthService,
              private fb:FormBuilder,
              private signin: MatDialog,
              private alertCode: AlertcodesService) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getErrorMessage(field: string): string{
    let message:string = "";

    if(this.signInForm.get(field).hasError('required')){ 
      message = 'You must enter a value.';
    }else if(this.signInForm.get(field).hasError('pattern')){
      message = 'Not a valid username.';
    }else if(this.signInForm.get(field).hasError('minlength')){
      message = 'This field must be longer.';
    }
    return message;
    
  }

  isValidField(field: string):boolean{
    return this.signInForm.get(field).touched || this.signInForm.get(field).dirty && !this.signInForm.get(field).valid;
  }
  onSignin(): void{
    if(this.signInForm.invalid){
      return;
    }
    
    const formValue: User | any = this.signInForm.value;

    let format: string = 'MM/dd/yyyy HH:mm:ss';
    let date: Date = new Date();
    let datepipe = new DatePipe('en-US').transform(date, format);
  
    formValue.UpdateAt = datepipe;

    this.authService.login(formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        this.closeSignIn();
      }
    },
    error => {
      if(error[0] == '400'){
        this.APIMessages = error[1];
      }else{
        this.alertCode.alertMessage(error[0],error[1]);
      }
    }    
    );
  }

  closeSignIn(): void{
      this.signin.closeAll();
  }
}
