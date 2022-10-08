import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserlogService } from 'src/app/services//userlog/userlog.service';
import { DatePipe } from '@angular/common';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { UserService } from 'src/app/services/user/user.service';
import { User, UserCreate } from 'src/app/interfaces/user/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usercreate-page',
  templateUrl: './userCreate-page.component.html',
  styleUrls: ['./userCreate-page.component.css']
})
export class UserCreatePageComponent implements OnInit, OnDestroy {

  pipe = new DatePipe('en-US');
  dateAction: any;
  
  hide = false;
  private isValidusername = /\S+\.\S+/;
  private destroy = new Subject<any>();

  userCreateForm: FormBuilder | any  = this.fb.group({
    name: ['',[Validators.required,Validators.pattern(/\S+/)]],
    rol: ['',[Validators.required,Validators.pattern(/\S+/),Validators.minLength(2)]],
    username: ['',[Validators.required,Validators.pattern(this.isValidusername)]],
    password: ['',[Validators.required, Validators.minLength(6)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA)
   public dialogRef: MatDialogRef<UserCreatePageComponent>,
   private userService:UserService,
   private userlogService:UserlogService,
   private fb:FormBuilder,
   private newUser: MatDialog,
   private router: Router,
   private today: DatePipe  
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
    
    const formValue: UserCreate = this.userCreateForm.value;
    this.userService.new(formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        window.location.reload();
        this.closenewUser();
      }
    });
  }

  changeReportUser(user: User) {
    const localitem: string | any = localStorage.getItem('user');
    const userToken = JSON.parse(localitem);


  
    //FALTA AQUI

    window.location.reload();
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