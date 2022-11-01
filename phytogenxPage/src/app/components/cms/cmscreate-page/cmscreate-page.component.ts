import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserlogService } from 'src/app/services/userlog/userlog.service';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { CmsService } from 'src/app/services/cms/cms.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Data } from '@angular/router';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { RestoreService } from 'src/app/services/restore/restore.service';
import { RpaService } from 'src/app/services/rpa/rpa.service';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

@Component({
  selector: 'app-cmscreate-page',
  templateUrl: './cmscreate-page.component.html',
  styleUrls: ['./cmscreate-page.component.css']
})
export class CmscreatePageComponent implements OnInit, OnDestroy {

  today = new Date();

  selectedFile: any;
  progress: number = 0;
  ApiMessage: string='';
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
  private cmsManually: MatDialog,
  private alert:AlertcodesService) { }

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

    this.cmsService.checkPDF_Name(this.selectedFile.fileName.split('.')[0]).pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res => {
        const fileForm = new FormData();
        fileForm.append('file',this.selectedFile.fileRaw,this.selectedFile.fileName);
        this.cmsService.upload(fileForm).pipe(
          takeUntil(this.destroy)
        ).subscribe(
          res => {
            this.createData();
          },error => {
            this.alert.alertMessage(error[0],error[1]);
          }
        );   
      },error=>{
        this.ApiMessage = error[1];
      }
    );
    



  }

  createData(){
    let convertdate = new DatePipe('en-US').transform(this.today,'MM/dd/yyyy HH:mm:ss');
    const formValue = this.cmsCreateForm.value;
    formValue.Date_CSM_Processed= convertdate;
    let splitstr:string[] = formValue.PDF_Name.split(".");

    formValue.PDF_Name = splitstr[0];
    formValue.Date_CSM_Processed = convertdate;
    formValue.Date_Quickbooks_Processed = 'Waiting for Invoice.'; 

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
              error =>{
                this.alert.alertMessage(error[0],error[1])
              }
            );
            this.closenewCms();
          }

        },error =>{
          this.alert.alertMessage(error[0],error[1]);
        });
      }
    }, error => {
      if(error[0] == '302'){
        this.ApiMessage = error[1];
      }else{
        this.alert.alertMessage(error[0],error[1]);
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
      },
      error =>{
        this.alert.alertMessage(error[0],error[1]);
      }
    );
  }

  saverestore(data: Data){
    this.restoreService.save(data).pipe(
      takeUntil(this.destroy),
    ).subscribe(res=>{
      },
     error =>{
        this.alert.alertMessage(error[0],error[1]);
      }
    );
  }

  onFileSelected(event:any):void{
    this.ApiMessage='';
    const [ file ] = event.target.files;
    this.cmsCreateForm.value.PDF_Name = file.name;
    this.selectedFile = {
      fileRaw:file,
      fileName:file.name
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
