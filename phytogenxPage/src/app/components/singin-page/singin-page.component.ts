import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-singin-page',
  templateUrl: './singin-page.component.html',
  styleUrls: ['./singin-page.component.css']
})
export class SinginPageComponent implements OnInit{
  hide = false;
  private isValidusername = /\S+\.\S+/;
  singInForm: FormBuilder | any  = this.fb.group({
    username: ['',[Validators.required,Validators.pattern(this.isValidusername)]],
    password: ['',[Validators.required, Validators.minLength(6)]]
  });

  constructor(private authService: AuthService,
              private fb:FormBuilder,
              private router: Router,
              private singin: MatDialog,
              ) { }

  ngOnInit(): void {
    
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
    this.authService.login(formValue).subscribe(res => {
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
