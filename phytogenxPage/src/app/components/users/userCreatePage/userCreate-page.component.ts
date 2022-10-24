import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { UserCreate } from 'src/app/interfaces/user/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

@Component({
  selector: 'app-usercreate-page',
  templateUrl: './userCreate-page.component.html',
  styleUrls: ['./userCreate-page.component.css']
})
export class UserCreatePageComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('en-US');
  dateAction: any;
  
  hide:boolean = false;
  APIMessage:string = '';

  private isValidusername = /\S+\.\S+/;
  private destroy = new Subject<any>();
  

  userCreateForm: FormBuilder | any  = this.fb.group({
    name: ['',[Validators.required,Validators.pattern(/\S+/)]],
    rol: ['',[Validators.required,Validators.pattern(/\S+/),Validators.minLength(2)]],
    username: ['',[Validators.required,Validators.pattern(this.isValidusername)]],
    password: ['',[Validators.required, Validators.minLength(6)]],
    createAt: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA)
    public dialogRef: MatDialogRef<UserCreatePageComponent>,
    private userService:UserService,
    private fb:FormBuilder,
    private newUser: MatDialog, 
    private alert: AlertcodesService
   ) {
   }
   
  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  ngOnInit(): void {
  }

  onnewUser(): void{
    if(this.userCreateForm.invalid){
      return;
    }
    const formValue: UserCreate | any = this.userCreateForm.value;
    
    let format: string = 'MM/dd/yyyy HH:mm:ss';
    let date: Date = new Date();
    let datepipe = new DatePipe('en-US').transform(date, format);

    formValue.createdAt = datepipe;

    this.userService.new(formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        window.location.reload();
        this.closenewUser();
      }
    },error => {
      if(error[0] == '302'){
        this.APIMessage = error[1];
      }else{
        this.alert.alertMessage(error[0],error[1]);
      }
    }
    );
  }

  rolOption(rol: string): string{
    return rol;
  }

  getErrorMessage(field: string): string{
    let message:string = "";

    if(this.userCreateForm.get(field).hasError('required')){ 
      message = 'You must enter a value.';
    }else if(this.userCreateForm.get(field).hasError('pattern')){
      message = 'Not a valid username.';
    }else if(this.userCreateForm.get(field).hasError('minlength')){
      message = 'This field must be longer.';
    }
    return message;
    
  }

  isValidField(field: string):boolean{
    return this.userCreateForm.get(field).touched || this.userCreateForm.get(field).dirty && !this.userCreateForm.get(field).valid;
  }

  closenewUser(): void{
      this.newUser.closeAll();
  }
  
}
