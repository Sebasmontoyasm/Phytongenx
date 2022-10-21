import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserlogService } from 'src/app/services/userlog/userlog.service';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { CmsService } from 'src/app/services/cms/cms.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Data } from '@angular/router';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { RestoreService } from 'src/app/services/restore/restore.service';
import { RpaService } from 'src/app/services/rpa/rpa.service';

@Component({
  selector: 'app-cmscreate-page',
  templateUrl: './cmscreate-page.component.html',
  styleUrls: ['./cmscreate-page.component.css']
})
export class CmscreatePageComponent implements OnInit, OnDestroy {

  today = new Date();

  selectedFiles?: any;
  progress: number = 0;
  currentFile?: any;
  message= '';
  fileInfos?: Observable<any>;

  private destroy = new Subject<any>();

  validatePDF = /\S+\.pdf/; 
  
  cmsCreateForm: FormBuilder | any  = this.fb.group({
    PO_Number: ['',[Validators.required,Validators.pattern(/\S+/),Validators.minLength(5)]],
    file: ['',[Validators.required,Validators.pattern(this.validatePDF)]],
    PDF_Name: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA)
  public dialogRef: MatDialogRef<CmscreatePageComponent>,
  private mdService:MasterDataService,
  private cmsService:CmsService,
  private userlogService:UserlogService,
  private restoreService:RestoreService,
  private rpaService: RpaService, 
  private fb:FormBuilder,
  private cmsManually: MatDialog) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  onCmsManually(): void{
    if(this.cmsCreateForm.invalid){
      return;
    }

    let convertdate = new DatePipe('en-US').transform(this.today,'MM/dd/yyyy HH:mm:ss');
    const formValue = this.cmsCreateForm.value;
    formValue.Date_CSM_Processed= convertdate;
    let splitstr:string[] = formValue.PDF_Name.split(".");

    formValue.PDF_Name = splitstr[0];
    formValue.Date_CSM_Processed = convertdate;
    formValue.Date_invoice_recieved = 'Waiting for Invoice.'; 

    this.mdService.new(formValue).pipe(
      takeUntil(this.destroy),
    ).subscribe(res => {

      let data:Data | any;

      if(res){
        this.mdService.lastData().pipe(
          takeUntil(this.destroy)
        ).subscribe(res => {
          if(res){
            data = res;
            this.createLog(data);
            this.saverestore(data);
            this.rpaService.report().pipe(
              takeUntil(this.destroy),
            ).subscribe(res=>{
                console.log("Reported RPA.");
              },
              err => console.log("Error: "+err),
            );
            this.closenewCms();
            window.location.reload();
          }

        });
      }
    });
  }
  
  createLog(data: Data) {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    let logdate = new Date();
    let convertdate = new DatePipe('en-US').transform(logdate,'MM/dd/yyyy HH:mm:ss');
    
    let userlog: UserLog = {
      idrestore : data.ID,
      username : user.username,
      rol : user.rol,
      action: 'CMS - Manually created purchase order.',
      date_action: convertdate
    };

    this.userlogService.new(userlog).subscribe(
      res=>{
        console.log("Log created.");
      },
      err => console.log("Error: "+err),
    );
  }

  saverestore(data: Data){
    this.restoreService.save(data).pipe(
      takeUntil(this.destroy),
    ).subscribe(res=>{
        console.log("Save in restore.");
      },
      err => console.log("Error: "+err),
    );
  }

  onFileSelected(event:any):void{
    this.selectedFiles = event.target.files;
    this.cmsCreateForm.value.PDF_Name = this.selectedFiles[0].name;
  }

  onUploadFile(){
      this.progress = 0;
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file) {
          this.currentFile = file;
          this.cmsService.upload(this.currentFile).subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                this.fileInfos = this.cmsService.getFiles();
              }     
            },
            error: (err: any) => {
              console.log(err);
              this.progress = 0;
  
              if (err.error && err.error.message) {
                this.message = err.error.message;
              } else {
                this.message = 'Could not upload the file!';
              }
              this.currentFile = undefined;
            }
          });
        }
        this.selectedFiles = undefined;
      }
    }  

    getErrorMessage(field: string): string{
      let message:string = "";
      if(this.cmsCreateForm.get(field).hasError('required')){ 
        message = 'You must enter a value.';
      }else if(this.cmsCreateForm.get(field).hasError('pattern') && field=='file'){
        message = 'Not a valid file format.';  
      }else if(this.cmsCreateForm.get(field).hasError('pattern')){
        message = 'Not a valid purchase number.';
      }else if(this.cmsCreateForm.get(field).hasError('minlength')){
        message = 'This field must be longer.';
      }

      return message;    
    }

    isValidField(field: string):boolean{
      return this.cmsCreateForm.get(field).touched || this.cmsCreateForm.get(field).dirty && !this.cmsCreateForm.get(field).valid;
    }
  
    closenewCms(): void{
        this.cmsManually.closeAll();
    }
    
}
