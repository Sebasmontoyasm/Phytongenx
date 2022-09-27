import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-singin-page',
  templateUrl: './singin-page.component.html',
  styleUrls: ['./singin-page.component.css']
})
export class SinginPageComponent implements OnInit {

  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
  passwordFormControl = new FormControl('', [Validators.required]);
  today = new Date();
  pipe = new DatePipe('en-US');

  singInForm = this.fb.group({
    username: ['sebastian.montoya'],
    password: ['1234'],
    lastlogin: this.pipe.transform(this.today, 'dd/MM/YYYY')
  });

  constructor(private authService: AuthService, private fb:FormBuilder,private router: Router, private singin: MatDialog) { }

  ngOnInit(): void {
  }

  onSingin(): void{
    const formValue:any = this.singInForm.value;
    console.log(formValue);
    this.authService.login(formValue).subscribe(res => {
      if(res){
        this.router.navigate(['']);
      }

    })
  }

  closeSingIn(): void{
      this.singin.closeAll();
  }

}
