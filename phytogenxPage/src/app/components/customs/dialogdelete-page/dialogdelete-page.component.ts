import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { UserlogService } from 'src/app/services//userlog/userlog.service';
import { DatePipe } from '@angular/common';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { UserService } from 'src/app/services/user/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'; 
import { RpaService } from 'src/app/services/rpa/rpa.service';
import { RestoreService } from 'src/app/services/restore/restore.service';
import { Data } from 'src/app/interfaces/data/data';


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
   private restoreService:RestoreService,
   private rpaService: RpaService,
   private userService: UserService
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
    if(this.data.title == 'CMS' || this.data.title == 'QB'){
      let oldData: Data;
      this.mdService.getById(this.data.id).pipe(
        takeUntil(this.destroy)
      ).subscribe(res =>{
        oldData = res;
        this.saverestore(oldData);

        this.mdService.deleteById(this.data.id).pipe(
          takeUntil(this.destroy)
          ).subscribe( res =>{
              if(!res){
                console.log("Deleting error.");
              } 
            }, err =>{
              console.log("Error delete data ID: "+err.errorMessage);
        });

        this.createLog(this.data.id,this.data.title);

        this.rpaService.report().pipe(
          takeUntil(this.destroy),
        ).subscribe( err =>{
          console.log("Error reporting rpa: "+err.errorMessage);
        });
        window.location.reload();
      });
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

  createLog(id: number, titleProcess: string) {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    let logdate = new Date();
    let convertdate = new DatePipe('en-US').transform(logdate,'MM/dd/yyyy HH:mm:ss');

    let userlog: UserLog = {
      idrestore : id,
      username : user.username,
      rol : user.rol,
      action: titleProcess+' - Deleted information.',
      date_action: convertdate
    };

    this.userlogService.new(userlog).subscribe(
      res=>{
        console.log("Response: \n",res);
      },
      err => console.log("Error: "+err)
    );
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
}
