import { Component,OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService} from 'src/app/services/cms/cms.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogdeletePageComponent } from '../../customs/dialogdelete-page/dialogdelete-page.component';
import { CmscreatePageComponent } from '../cmscreate-page/cmscreate-page.component';
import { Subject } from 'rxjs';
import { Cms, CmsUpdate } from 'src/app/interfaces/cms/cms';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { Roles } from 'src/app/interfaces/user/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { UserlogService } from 'src/app/services/userlog/userlog.service';
import { Data } from 'src/app/interfaces/data/data';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { RestoreService } from 'src/app/services/restore/restore.service';
import { RpaService } from 'src/app/services/rpa/rpa.service';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

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

  selectedFile: any;

  fileName: string = '';
  today:Date = new Date();
  comment: string = '';

  ApiMessage:string = '';
  
  private destroy = new Subject<any>();

  validatePDF = /\S+\.pdf/;

  cmsUpdateForm: FormBuilder | any  = this.fb.group({
    reason: ['',[Validators.required]],
    comment: [{value:'',disabled:true},[Validators.required,Validators.pattern(/\S+/)]],
    cmsDate: ['',[Validators.required]],
    PDF_Name: [''],
    file: ['',[Validators.required,Validators.pattern(this.validatePDF)]]
  });

  constructor(
    private fb: FormBuilder,
    private cmsService:CmsService,
    private dialog: MatDialog,
    private userlogService: UserlogService,
    private mdService: MasterDataService,
    private restoreService: RestoreService,
    private rpaService: RpaService,
    private alert: AlertcodesService
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
      error =>{
        this.alert.alertMessage(error[0],error[1]);
      }
    );

  }

  onUpdate(id: number): void{
    if(this.cmsUpdateForm.invalid){
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
            this.updateData(id);
          },error => {
            this.alert.alertMessage(error[0],error[1]);
          }
        );   
      },error=>{
        this.ApiMessage = error[1];
      }
    );
  }
  
  updateData(id:number){
    let oldData: Data;
    this.mdService.getById(id).pipe(
      takeUntil(this.destroy),
    ).subscribe(res => {
      if(res){
        oldData = res;
      }
    }, error => {
      this.alert.alertMessage(error[0],error[1]);
    });

    const formValue: CmsUpdate | any = this.cmsUpdateForm.value;
    let convertDate = new DatePipe('en-US').transform(formValue.cmsDate,'MM/dd/yyyy HH:mm:ss');
    let convertPDF_Name: string[] = formValue.PDF_Name.split('.');

    formValue.cmsDate = convertDate;
    formValue.PDF_Name = convertPDF_Name[0];
    this.cmsService.update(id,formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        this.createLog(id);
        this.saverestore(oldData);

        this.rpaService.report().pipe(
          takeUntil(this.destroy),
        ).subscribe(res=>{
            if(res){
              console.log(res);
            }
          },
          error => {
            this.alert.alertMessage(error[0],error[1]);
          }
        );
      }
    }, error => {
      this.alert.alertMessage(error[0],error[1]);
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
    this.ApiMessage='';
    const [ file ] = event.target.files;
    this.cmsUpdateForm.value.PDF_Name = file.name;
    this.selectedFile = {
      fileRaw:file,
      fileName:file.name
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

  weekendFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CmscreatePageComponent, {
      position: {top: '130px'},
      width: '30%',
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
    }, error => {
      this.alert.alertMessage(error[0],error[1]);
    });
  }

  createLog(id: number) {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    const formvalue: CmsUpdate = this.cmsUpdateForm.value;
    let logdate = new Date();
    let convertdate = new DatePipe('en-US').transform(logdate,'MM/dd/yyyy HH:mm:ss');
    
    if(formvalue.comment == undefined){
      this.comment = formvalue.reason;   
    }else{
      this.comment =formvalue.reason+' '+formvalue.comment; 
    }

    let userlog: UserLog = {
      idrestore : id,
      username : user.username,
      rol : user.rol,
      action: 'CMS - Updated information.',
      comment: this.comment,
      date_action: convertdate
    };

    this.userlogService.new(userlog).subscribe(
      res=>{
        console.log("Response: \n",res);
      },
      error =>{
        this.alert.alertMessage(error[0],error[1]);
      }
    );
  }
}

