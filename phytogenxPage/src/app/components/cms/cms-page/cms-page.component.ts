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
import { Roles } from 'src/app/interfaces/user/user';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { UserlogService } from 'src/app/services/userlog/userlog.service';
import { Data } from 'src/app/interfaces/data/data';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { RestoreService } from 'src/app/services/restore/restore.service';
import { RpaService } from 'src/app/services/rpa/rpa.service';

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

  rol: Roles = 'guest';

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
  today = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
  comment: string = '';
  
  private destroy = new Subject<any>();

  validatePDF = /\S+\.pdf/;
  cmsUpdateForm: FormBuilder | any  = this.fb.group({
    reason: ['',[Validators.required]],
    comment: [{value:'',disabled:true},[Validators.required,Validators.pattern(/\S+/)]],
    cmsDate: [this.today,[Validators.required]],
    PDF_Name: [''],
    file: ['',[Validators.required,Validators.pattern(this.validatePDF)]]

  });

  constructor(
    private cmsService:CmsService,
    private dialog: MatDialog,
    private fb:FormBuilder,
    private datePipe: DatePipe,
    private userlogService: UserlogService,
    private mdService: MasterDataService,
    private restoreService: RestoreService,
    private rpaService: RpaService
    ) { 
    }

  ngOnInit(): void {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);
    this.rol = user.rol;

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
      err => console.log("Error CMS update: "+err)
    );
  }

  onUpdate(id: number): void{
    if(this.cmsUpdateForm.invalid){
      return;
    }

    let oldData: Data;
    this.mdService.getById(id).pipe(
      takeUntil(this.destroy),
    ).subscribe(res => {
      if(res){
        oldData = res;
      }
    });

    const formValue: CmsUpdate | any = this.cmsUpdateForm.value;
    let convertDate = new DatePipe('en-US').transform(formValue.cmsDate,'MM/dd/yyyy HH:mm');
    let convertPDF_Name: string[] = formValue.PDF_Name.split('.');

    formValue.cmsDate = convertDate;
    formValue.PDF_Name = convertPDF_Name[0];

    this.cmsService.update(id,formValue).pipe(
      takeUntil(this.destroy),
    ).subscribe(res => {
      if(res){
        this.createLog(id);
        this.saverestore(oldData);

        this.rpaService.report().pipe(
          takeUntil(this.destroy),
        ).subscribe(res=>{
            if(res){
              console.log("Reported RPA.");
            }
          },
          err => console.log("Error: "+err),
        );
      }
    }); 
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
    this.cmsUpdateForm.value.PDF_Name = this.selectedFiles[0].name;
  }

  onUploadFile(){
      //PENDIENTE
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
   openDeleteDialog(id:number, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogdeletePageComponent, {
    width: '250px',
    enterAnimationDuration,
    exitAnimationDuration,
    data:{ id: id,title:'CMS'}
  });
  }

  otherOption(option:string){
    if(option=='enable'){
      this.cmsUpdateForm.get('comment').status = "ENABLED";
    }else if(option=='disable'){
      this.cmsUpdateForm.get('comment').status = "DISABLED";
      this.cmsUpdateForm.value.comment='';
      this.comment='';
    }
  }

  isValidField(field: string):boolean{
    return this.cmsUpdateForm.get(field).touched || this.cmsUpdateForm.get(field).dirty && !this.cmsUpdateForm.get(field).valid;
  }

  getErrorMessage(field: string): string{
    let message:string = "";
    if(this.cmsUpdateForm.get(field).hasError('pattern') && field === 'file'){
      message = 'Not a valid file format.';  
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
      height: '54%',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }

  saverestore(oldData: Data){
    this.restoreService.save(oldData).pipe(
      takeUntil(this.destroy),
    ).subscribe(res => {
      if(res){
        window.location.reload();
      }
    });
  }

  createLog(id: number) {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    const formvalue: CmsUpdate = this.cmsUpdateForm.value;
    let logdate = new Date();
    let convertdate = new DatePipe('en-US').transform(logdate,'MM/dd/yyyy HH:mm:ss');

    let userlog: UserLog = {
      idrestore : id,
      username : user.username,
      rol : user.rol,
      action: 'CMS - Updated information.',
      comment: formvalue.reason+' '+formvalue.comment,
      date_action: convertdate
    };

    this.userlogService.new(userlog).subscribe(
      res=>{
        console.log("Response: \n",res);
      },
      err => console.log("Error: "+err)
    );
  }
}

