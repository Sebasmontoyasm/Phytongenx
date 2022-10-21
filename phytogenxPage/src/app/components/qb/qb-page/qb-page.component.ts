import { Component, OnInit,OnDestroy, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QbService } from 'src/app/services/qb/qb.service';
import { Qb, QbUpdate } from 'src/app/interfaces/qb/qb';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogdeletePageComponent } from '../../customs/dialogdelete-page/dialogdelete-page.component';
import { MatDialog } from '@angular/material/dialog';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Roles } from 'src/app/interfaces/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from 'src/app/interfaces/data/data';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { RpaService } from 'src/app/services/rpa/rpa.service';
import { RestoreService } from 'src/app/services/restore/restore.service';
import { UserlogService } from 'src/app/services/userlog/userlog.service';

@Component({
  selector: 'app-qb-page',
  templateUrl: './qb-page.component.html',
  styleUrls: ['./qb-page.component.css']
})
export class QbPageComponent implements OnInit, OnDestroy {
  rol: Roles = 'guest';
  title = 'data-table';

  private destroy = new Subject<any>();
  
  displayedColumn: string[] =['ID','PO_Number','Invoice','Reason','Comment','NamePDF','Date_invoice_recieved','Actions'];
  dataSource!: MatTableDataSource<Qb>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  posts:any;

  selectedFiles?: any;
  progress: number = 0;
  currentFile?: any;
  message= '';
  fileInfos?: Observable<any>;
  
  fileName: string = '';
  today = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm')
  comment: string = '';

  validatePDF = /\S+\.pdf/; 

  qbUpdateForm: FormBuilder | any  = this.fb.group({
    reason: ['',[Validators.required]],
    comment: [{value:'',disabled:true},[Validators.required,Validators.pattern(/\S+/)]],
    NamePDF: [''],
    file: ['',[Validators.required,Validators.pattern(this.validatePDF)]],
    Date_invoice_recieved: [this.today,[Validators.required]],
    Invoice_Number: ['',[Validators.pattern('^[0-9]*$'),Validators.minLength(4)]]
  });
  constructor(private qbService:QbService,
              private dialog: MatDialog,
              private fb:FormBuilder,
              private router: Router,
              private datePipe: DatePipe,
              private _snackBar: MatSnackBar,
              private mdService: MasterDataService,
              private rpaService: RpaService,
              private restoreService: RestoreService,
              private userlogService: UserlogService) { }

  ngOnInit(): void {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);
    this.rol = user.rol;
    
    this.getQb();
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getQb()
  {
    this.qbService.get().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.log("Error Qb Update: "+err)
    );
  }

  onUpdate(id: number): void{
    if(this.qbUpdateForm.invalid){
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
    const formValue: QbUpdate | any = this.qbUpdateForm.value;
    let convertDate = new DatePipe('en-US').transform(formValue.Date_invoice_recieved,'MM/dd/yyyy HH:mm:ss');
    formValue.Date_invoice_recieved = convertDate;
    formValue.NamePDF = this.fileName;
    
    console.log("FORMULARIO DESPUES DE NORMALIZAR:\n",formValue);
    this.qbService.update(id,formValue).pipe(
      takeUntil(this.destroy)
    ).subscribe(res => {
      if(res){
        this.createLog(id);
        this.saverestore(oldData);

        this.rpaService.report().pipe(
          takeUntil(this.destroy),
        ).subscribe(res=>{
            if(!res){
              console.log("Somenthing wrong");
            }
          },
          error => console.log("Error with RPA report: "+error),
        );
      }
    }); 
  }

  otherOption(option:string){
    if(option=='enable'){
      this.qbUpdateForm.get('comment').status = "ENABLED";
    }else if(option=='disable'){
      this.qbUpdateForm.get('comment').status = "DISABLED";
      this.qbUpdateForm.value.comment='';
      this.comment='';
    }
  }


  saverestore(oldData: Data){
    this.restoreService.save(oldData).pipe(
      takeUntil(this.destroy),
    ).subscribe(res => {
      if(res){
        //window.location.reload();
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
    this.fileName = this.selectedFiles[0].name;
  }

  onUploadFile(){
    //PENDIENTE
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.qbService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.qbService.getFiles();
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
    
  createLog(id: number) {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    const formvalue: QbUpdate | any = this.qbUpdateForm.value;
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
      action: 'QB - Updated information.',
      comment: this.comment,
      date_action: convertdate
    };

    this.userlogService.new(userlog).subscribe(
      res=>{
        console.log("Log Created: \n",res);
      },
      error => console.log("Something wrong.: "+error)
    );
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
    data:{ id: id,title:'QB'}
  });
  }

  onReturn(){
    this.router.navigate(['/masterdata']);
  }

  isValidField(field: string):boolean{
    return this.qbUpdateForm.get(field).touched || this.qbUpdateForm.get(field).dirty && !this.qbUpdateForm.get(field).valid;
  }

  getErrorMessage(field: string): string{
    let message:string = "";

    if(this.qbUpdateForm.get(field).hasError('pattern') && field === 'file'){
      message = 'Not a valid file format.';  
    }
    else if(this.qbUpdateForm.get(field).hasError('required') && field === 'file'){
      message = 'Select file.';  
    }
    else if(this.qbUpdateForm.get(field).hasError('required')){ 
      message = 'You must enter a value.';
    }else if(this.qbUpdateForm.get(field).hasError('pattern')){
      message = 'Not a valid value.';
    }else if(this.qbUpdateForm.get(field).hasError('minlength')){
      message = 'This field must be longer.';
    }

    return message;
  }
  
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Done");
  }
}
