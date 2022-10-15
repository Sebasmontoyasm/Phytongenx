import { Component,OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService} from 'src/app/services/cms/cms.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogdeletePageComponent } from '../../customs/dialogdelete-page/dialogdelete-page.component';
import { CmscreatePageComponent } from '../cmscreate-page/cmscreate-page.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Cms, CmsUpdate } from 'src/app/interfaces/cms/cms';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.css']
})
/**
 * Pagina principal para actualización
 * de CMS que se hicieron manual o tienen un error.
 */
export class CmsPageComponent implements OnInit, OnDestroy {

  title = 'data-table';
  displayedColumn: string[] =['ID','PO_NUMBER','Reason','Comment','Date_CSM_Processed','Upload_PDF','Actions'];
  dataSource!: MatTableDataSource<Cms>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  posts:any = [];

  selectedFiles?: any;
  progress: number = 0;
  currentFile?: any;
  message= '';
  fileInfos?: Observable<any>;

  fileName: string = '';
  today = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm')
  date: string | null = '';

  reason: string = "";
  idupdate = 0;

  usrlog: UserLog = {
    user: 1,
    rol: "Tester",
    action: "",
    dateaction: "",
    iddata: 0,
    idpo: 0,
    idinvoce: 0,
    comments: "",    
  };
  
  private destroy = new Subject<any>();
  validatePDF = /\S+\.pdf/; 
  cmsUpdateForm: FormBuilder | any  = this.fb.group({
    reason: ['',[Validators.required]],
    comment: ['',[Validators.required,Validators.pattern(/\S+/)]],
    cmsDate: [this.today,[Validators.required]],
    PDF_Name: [''],
    file: ['',[Validators.required,Validators.pattern(this.validatePDF)]]

  });

  constructor(
    private cmsService:CmsService,
    private dialog: MatDialog,
    private fb:FormBuilder,
    private router: Router,
    private datePipe: DatePipe
    ) { 
    }

  ngOnInit(): void {
    this.getCms();
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getCms()
  {
    this.cmsService.manually().subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.log("Error CMS Update: "+err)
    );
  }

  onUpdate(id: number): void{
    if(this.cmsUpdateForm.invalid){
      return;
    }

    if(this.checkPDF(this.cmsUpdateForm.value.PDF_Name)){
      const formValue: CmsUpdate | any = this.cmsUpdateForm.value;
      this.cmsService.update(id,formValue).pipe(
        takeUntil(this.destroy),
      ).subscribe(res => {
        if(res){
          window.alert('Update');
        }
  
      });
    }else{
      window.alert('The format of the PDF is incorrect.');
    }
  }
  
  /**
   * recolecta el PDF cargado para mandarlo al backend
   * @param event PDF file.
   */
  chooseFile(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFileSelected(event:any):void{
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;
    this.cmsUpdateForm.value.PDF_Name = this.fileName;
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
  
  /**
   * Animacion para abrir una ventana emergente
   * Para confirmar eliminación de archivo.
   * @param enterAnimationDuration animacion de ventana emergente
   * @param exitAnimationDuration cerrado de animacion
   * @parama data recolecta el id y el log con los comentarios para guardar
   */
   openDialog(id:number, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogdeletePageComponent, {
    width: '250px',
    enterAnimationDuration,
    exitAnimationDuration,
    data:{ id: id, userlog: this.usrlog,title:'cms'}
  });
  }

  isValidField(field: string):boolean{
    return this.cmsUpdateForm.get(field).touched || this.cmsUpdateForm.get(field).dirty && !this.cmsUpdateForm.get(field).valid;
  }

  checkPDF(PDF_Name: string) {
    let pdf:string[] = PDF_Name.split("."); 
    
    if(pdf[1] == undefined){
      return false;
    }else if(pdf[1].toUpperCase() === 'PDF'){
      this.cmsUpdateForm.value.PDF_Name = pdf[0];
      return true;
    }

    return false;
  }

  getErrorMessage(field: string): string{
    let message:string = "";
    if(this.cmsUpdateForm.get(field).hasError('required') && field === 'file'){
      message = 'Select file.';  
    }
    else if(this.cmsUpdateForm.get(field).hasError('required')){ 
      message = 'You must enter a value.';
    }else if(this.cmsUpdateForm.get(field).hasError('pattern')){
      message = 'Not a valid comment.';
    }

    return message;
  }

  /**
   * Función de busqueda de filtro
   * en el la tabla dinamacia de angular
   * material 
   * @param event cambios en el Filter Table para busqueda. 
   */
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CmscreatePageComponent, {
      position: {top: '130px'},
      width: '40%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }

}

