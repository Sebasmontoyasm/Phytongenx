import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { User, UserEdit } from 'src/app/interfaces/user/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

@Component({
  selector: 'app-useredit-page',
  templateUrl: './useredit-page.component.html',
  styleUrls: ['./useredit-page.component.css']
})
export class UsereditPageComponent implements OnInit, OnDestroy {

  today = new Date();
  pipe = new DatePipe('en-US');
  dateAction: any;

  hide = false;
  private destroy = new Subject<any>();

  userEditForm: FormBuilder | any  = this.fb.group({
    name: ['',[Validators.required,Validators.pattern(/\S+/)]],
    rol: ['',[Validators.required,Validators.pattern(/\S+/),Validators.minLength(2)]],
    password: ['',[Validators.minLength(6)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: {user: UserEdit},
   public dialogRef: MatDialogRef<UsereditPageComponent>,
   private userService:UserService,
   private fb:FormBuilder,
   private editUser: MatDialog,
   private alert:AlertcodesService
   ) {
   }
   
  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  ngOnInit(): void {
  }

  onEditUser(): void{
    if(this.userEditForm.invalid){
      return;
    }
    
    const formValue: User | any = this.userEditForm.value;
    this.userService.update(this.data.user.id,formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        window.location.reload();
        this.closeEditUser();
        this.alert.alertMessage('201',res.message);
      }
    },error => {
        this.alert.alertMessage(String(error[0]),error[1]);
    });

  }

  getErrorMessage(field: string): string{
    let message:string = "";

    if(this.userEditForm.get(field).hasError('required')){ 
      message = 'You must enter a value.';
    }else if(this.userEditForm.get(field).hasError('pattern')){
      message = 'Not a valid username.';
    }else if(this.userEditForm.get(field).hasError('minlength')){
      message = 'This field must be longer.';
    }
    return message;
    
  }

  isValidField(field: string):boolean{
    return this.userEditForm.get(field).touched || this.userEditForm.get(field).dirty && !this.userEditForm.get(field).valid;
  }

  closeEditUser(): void{
      this.editUser.closeAll();
  }
  
}
