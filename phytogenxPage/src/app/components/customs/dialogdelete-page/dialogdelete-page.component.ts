import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { UserlogService } from 'src/app/services//userlog/userlog.service';
import { DatePipe } from '@angular/common';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { UserService } from 'src/app/services/user/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dialogdelete-page',
  templateUrl: './dialogdelete-page.component.html',
  styleUrls: ['./dialogdelete-page.component.css']
})

export class DialogdeletePageComponent implements OnInit, OnDestroy {

  datadelete: any;
  today = new Date();
  pipe = new DatePipe('en-US');
  dateAction: any;
  private destroy = new Subject<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: number,title:string},
   public dialogRef: MatDialogRef<DialogdeletePageComponent>,
   private mdService:MasterDataService,
   private userlogService:UserlogService,
   private userService: UserService,
   private route: Router  
   ) {
   }
  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  ngOnInit(): void {

  }
  /**
   * Metodo para eliminar una fila en la tabla Data
   * El metodo realiza un backup en data_delete y posterior elimina el archivo.
   */
  deleteService() {
    if(this.data.title == 'cms'){
      this.mdService.dataDeleteBackup(this.data.id).subscribe(
        res=>{
          this.changeReportUser(res);
          return res; 
        },
        err => console.log("Error Backup delete data: "+err.errorMessage)
      );
  
      this.mdService.deleteDataID(this.data.id).subscribe(
        res=>{
          return res; 
        },
        err => console.log("Error delete data ID: "+err.errorMessage)
      );
    }else if(this.data.title == 'users'){
      this.userService.delete(this.data.id).pipe(
        takeUntil(this.destroy)
      ).subscribe(res => {
        if(!res){
          window.alert(res);
        }
      });
      window.location.reload();
    }
  }
  
  changeReportUser(res: Object){
    
    this.datadelete = Object.values(res);
    let ChangedFormat = this.pipe.transform(this.today, 'dd/MM/YYYY');
    this.dateAction = ChangedFormat;
   
    // FALTA re crear el user logs.

    window.location.reload();
  }
}
