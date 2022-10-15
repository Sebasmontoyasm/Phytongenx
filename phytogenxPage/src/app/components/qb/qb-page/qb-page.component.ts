import { Component, OnInit,OnDestroy, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QbService } from 'src/app/services/qb/qb.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Qb, QbUpdate } from 'src/app/interfaces/qb/qb';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogdeletePageComponent } from '../../customs/dialogdelete-page/dialogdelete-page.component';
import { MatDialog } from '@angular/material/dialog';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-qb-page',
  templateUrl: './qb-page.component.html',
  styleUrls: ['./qb-page.component.css']
})
export class QbPageComponent implements OnInit, OnDestroy {
  rol = "guest";
  title = 'data-table';
  private destroy = new Subject<any>();
  displayedColumn: string[] =['ID','PO_Number','Invoice','NamePDF','Reason','Comment','NamePDF','Date_invoice_recieved','Actions'];
  dataSource!: MatTableDataSource<Qb>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  posts:any;

  today = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm')

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

  qbUpdateForm: FormBuilder | any  = this.fb.group({
    reason: ['',[Validators.required]],
    comment: ['',[Validators.required,Validators.pattern(/\S+/)]],
    NamePDF: ['',[Validators.required,Validators.pattern(/\S+\.pdf/)]],
    invoceDate: [this.today,[Validators.required]]
  });
  constructor(private qbService:QbService,
              private dialog: MatDialog,
              private fb:FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getQb();
    this.rol = this.checkrol();  
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  checkrol(){
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);
    return user.rol;
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
      err => console.log("Error: "+err)
    );
  }

  onUpdate(id: number): void{
    if(this.qbUpdateForm.invalid){
      return;
    }
      const formValue: QbUpdate | any = this.qbUpdateForm.value;
      this.qbService.update(id,formValue).pipe(
        takeUntil(this.destroy),
      ).subscribe(res => {
        if(res){
          window.alert('Update');
        }
  
      });
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
    data:{ id: id, userlog: this.usrlog,title:'qb'}
  });
  }

  isValidField(field: string):boolean{
    return this.qbUpdateForm.get(field).touched || this.qbUpdateForm.get(field).dirty && !this.qbUpdateForm.get(field).valid;
  }

  getErrorMessage(field: string): string{
    let message:string = "";
    if(this.qbUpdateForm.get(field).hasError('required') && field === 'file'){
      message = 'Select file.';  
    }
    else if(this.qbUpdateForm.get(field).hasError('required')){ 
      message = 'You must enter a value.';
    }else if(this.qbUpdateForm.get(field).hasError('pattern')){
      message = 'Not a valid comment.';
    }

    return message;
  }
  
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
