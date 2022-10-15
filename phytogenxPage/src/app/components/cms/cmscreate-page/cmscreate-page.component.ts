import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserlogService } from 'src/app/services//userlog/userlog.service';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { CmsService } from 'src/app/services/cms/cms.service';
import { CmsCreate } from 'src/app/interfaces/cms/cms';
import { User } from 'src/app/interfaces/user/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';


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
  fileName: string = '';

  cmsCreateForm: FormBuilder | any  = this.fb.group({
    ponumber: ['',[Validators.required,Validators.pattern(/\S+/)]],
    file: ['',[Validators.required]],
    PDFName: ['',Validators.pattern(this.validatePDF)],
  });

  constructor(@Inject(MAT_DIALOG_DATA)
  public dialogRef: MatDialogRef<CmscreatePageComponent>,
  private cmsService:CmsService,
  private userlogService:UserlogService,
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
    
    const formValue: CmsCreate = this.cmsCreateForm.value;
    formValue.Date_CSM_Processed = this.today;
    let splitstr:string[] = formValue.PDF_Name.split(".");
    formValue.PDF_Name = splitstr[0];
    this.cmsService.new(formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        window.location.reload();
        this.closenewCms();
      }
    });
  }
  changeReportUser(user: User) {
    const localitem: string | any = localStorage.getItem('user');
    const userToken = JSON.parse(localitem);
    //FALTA AQUI
    window.location.reload();
  }

  /**
   * recolecta el PDF cargado para mandarlo al backend
   * @param event PDF file.
   */
   chooseFile(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("ChooseFile: ",filterValue);
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFileSelected(event:any):void{
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;
    this.cmsCreateForm.value.PDF_Name = this.fileName;

    this.isValidField('PDFName');
    this.getErrorMessage('PDFName');

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
      }else if(this.cmsCreateForm.get(field).hasError('pattern')){
        message = 'Not a valid PO Number.';
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
