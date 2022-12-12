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
import { Roles } from 'src/app/interfaces/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from 'src/app/interfaces/data/data';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { RpaService } from 'src/app/services/rpa/rpa.service';
import { RestoreService } from 'src/app/services/restore/restore.service';
import { UserlogService } from 'src/app/services/userlog/userlog.service';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

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

  ApiMessage:string='';
  ApiMessagePDF:string='';

  selectedFile: any;
  
  fileName: string = '';
  today:Date = new Date();
  comment: string = '';

  validatePDF = /\S+\.pdf/; 

  qbUpdateForm: FormBuilder | any  = this.fb.group({
    reason: ['',[Validators.required]],
    comment: [{value:'',disabled:true},[Validators.required,Validators.pattern(/\S+/)]],
    NamePDF: [''],
    file: ['',[Validators.required,Validators.pattern(this.validatePDF)]],
    Date_invoice_recieved: ['',[Validators.required]],
    Invoice_Number: ['',[Validators.required,Validators.pattern('^[0-9]*$'),Validators.minLength(4)]]
  });
  constructor(private qbService:QbService,
              private dialog: MatDialog,
              private fb:FormBuilder,
              private router: Router,
              private _snackBar: MatSnackBar,
              private mdService: MasterDataService,
              private rpaService: RpaService,
              private restoreService: RestoreService,
              private userlogService: UserlogService,
              private alert: AlertcodesService) { }

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
      error => {
        this.alert.alertMessage(error[0],error[1]);
      }
    );
  }

  onUpdate(id: number): void{
    if(this.qbUpdateForm.invalid){
      return;
    }
    
    this.qbService.checkNamePDF(this.selectedFile.fileName).pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res => {
        const fileForm = new FormData();
        fileForm.append('file',this.selectedFile.fileRaw,this.selectedFile.fileName);
        this.qbService.upload(fileForm).pipe(
          takeUntil(this.destroy)
        ).subscribe(
          res => {
            this.updateData(id);
          },error => {
            this.alert.alertMessage(error[0],error[1]);
          }
        );   
      },error=>{
        this.ApiMessagePDF = error[1];
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
    },error => {
      this.alert.alertMessage(error[0],error[1]);
    });

    const formValue: QbUpdate | any = this.qbUpdateForm.value;
    let convertDate = new DatePipe('en-US').transform(formValue.Date_invoice_recieved,'MM/dd/yyyy HH:mm:ss');
    formValue.Date_invoice_recieved = convertDate;
    formValue.NamePDF = this.fileName;
  
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
          error => {
            this.alert.alertMessage(error[0],error[1]);  
          }
        );
      }
    }, error => {
      if(error[0]=='302'){
        this.ApiMessage = error[1];
      }else{
        this.alert.alertMessage(error[0],error[1]);
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
  weekendFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  saverestore(oldData: Data){
    this.restoreService.save(oldData).pipe(
      takeUntil(this.destroy),
    ).subscribe(res => {
      if(res){
        window.location.reload();
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
    this.ApiMessagePDF='';
    const [ file ] = event.target.files;

    this.fileName = file.name;
    this.selectedFile = {
      fileRaw:file,
      fileName:file.name
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
      error => {
        this.alert.alertMessage(error[0],error[1]);
      }
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
