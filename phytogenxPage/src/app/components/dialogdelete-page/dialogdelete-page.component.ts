import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from 'src/app/services/masterdata.service';
import { UserlogService } from 'src/app/services/userlog.service';
import { DatePipe } from '@angular/common';

export interface UserLog{
  user?:number;
  rol?: string;
  action?: string;
  dateaction: string;
  iddata: number;
  idpo: number;
  idinvoce: number;
  comments: string;
}

@Component({
  selector: 'app-dialogdelete-page',
  templateUrl: './dialogdelete-page.component.html',
  styleUrls: ['./dialogdelete-page.component.css']
})

export class DialogdeletePageComponent implements OnInit {

  datadelete: any;
  today = new Date();
  pipe = new DatePipe('en-US');
  dateAction: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: number,userlog: UserLog},
   public dialogRef: MatDialogRef<DialogdeletePageComponent>,
   private mdService:MasterDataService,
   private userlogService:UserlogService  
   ) {
   }

  ngOnInit(): void {

  }
  /**
   * Metodo para eliminar una fila en la tabla Data
   * El metodo realiza un backup en data_delete y posterior elimina el archivo.
   */
  deleteService() {
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
 
    
  }
  
  changeReportUser(res: Object){
    
    this.datadelete = Object.values(res);
    let ChangedFormat = this.pipe.transform(this.today, 'dd/MM/YYYY');
    this.dateAction = ChangedFormat;
    this.data.userlog.dateaction = this.dateAction;
    this.data.userlog.action = "Delete in CMS Page Controller.";
    this.data.userlog.comments = "Deleting Manually";
    this.data.userlog.iddata = this.data.id;
    this.data.userlog.idpo = this.datadelete[1];
    this.data.userlog.idinvoce = this.datadelete[4];
    
    this.userlogService.reportUser(this.data.userlog);

    window.location.reload();
  }
}
