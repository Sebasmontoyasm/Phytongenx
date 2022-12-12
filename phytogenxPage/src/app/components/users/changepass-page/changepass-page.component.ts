import { Component, OnInit,OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { ChangePass} from 'src/app/interfaces/user/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-changepass-page',
  templateUrl: './changepass-page.component.html',
  styleUrls: ['./changepass-page.component.css']
})
export class ChangepassPageComponent implements OnInit, OnDestroy {
  today = new Date();
  pipe = new DatePipe('en-US');
  dateAction: any;

  hide: boolean = false;
  hide2: boolean = false;
  mathpass: boolean = true;
  reply: string = '';

  private destroy = new Subject<any>();
  ApiMessage:string = '';

  localitem: string | any = localStorage.getItem('user');
  user = JSON.parse(this.localitem);

  changePassForm: FormBuilder | any  = this.fb.group({
    password: ['',[Validators.required,Validators.minLength(6)]],
    newpassword: ['',[Validators.required,Validators.minLength(6)]],
    replypass: [this.reply,[Validators.required,Validators.minLength(6)]]
  });

  constructor(
  public dialogRef: MatDialogRef<ChangepassPageComponent>,
  private authService:AuthService,
  private fb:FormBuilder,
  private changePass: MatDialog,
  private alert:AlertcodesService) { }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  ngOnInit(): void {
    
  }

  onchangePass(): void{
    if(this.changePassForm.invalid){
      return;
    }

    const formValue: ChangePass = {
      username: this.user.username,
      password: this.changePassForm.value.password,
      newpassword: this.changePassForm.value.newpassword
    };
    this.authService.changePassword(formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        this.closechangePass();
        this.authService.loginout();
        window.location.reload();
      }
    },error => {
        if(error[0] = 401){
          this.ApiMessage = error[1];
        }else{
          this.alert.alertMessage(String(error[0]),error[1]);
        }      
    });

  }

  getErrorMessage(field: string): string{
    let message:string = "";

    if(this.changePassForm.get(field).hasError('required')){ 
      message = 'You must enter a value.'
    }else if(this.changePassForm.get(field).hasError('minlength')){
      message = 'This field must be longer.';
    }else if(field === 'replypass' || field === 'newpassword'){
      if((this.changePassForm.value.newpassword != this.changePassForm.value.replypass) && (this.changePassForm.value.newpassword != '' || this.changePassForm.value.replypass != '')){
        message = 'password does not match.';
      }
    }
    return message;
    
  }

  isValidField(field: string):boolean{
    if(this.changePassForm.value.newpassword === '' || this.changePassForm.value.replypass === ''){
      this.mathpass = true;
      return true;
    }else if(!this.changePassForm.get(field).valid){
      this.mathpass = true;
      return true;
    }else if((this.changePassForm.value.newpassword != this.changePassForm.value.replypass)){

      this.changePassForm.get("replypass").status = "INVALID";
      this.mathpass = true;
      return true;
    }else if((this.changePassForm.value.newpassword === this.changePassForm.value.replypass) && this.changePassForm.get('password').valid){

      this.changePassForm.get("replypass").status = "VALID";
      this.mathpass=false;
      return false;
    }
    else{
      this.mathpass = true;
      return true;
    } 
  } 

  closechangePass(): void{
      this.changePass.closeAll();
  }
}
