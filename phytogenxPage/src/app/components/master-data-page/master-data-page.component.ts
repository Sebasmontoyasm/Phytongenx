import { Component, OnInit, ViewChild,OnDestroy} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MasterDataService } from 'src/app/services/masterdata/masterdata.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from 'src/app/interfaces/data/data';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

@Component({
  selector: 'app-master-data-page',
  templateUrl: './master-data-page.component.html',
  styleUrls: ['./master-data-page.component.css']
})

export class MasterDataPageComponent implements OnInit, OnDestroy {
  rol = "guest";
  title = 'data-table';
  private destroy = new Subject<any>();
  displayedColumn: string[] =['ID','PO_Number','Date_CSM_Processed','PDF_Name','NamePDF','Invoice_Number','Date_invoice_recieved','Date_Quickbooks_Processed','DelayQb','DaysSince'];
  dataSource!: MatTableDataSource<Data>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private masterDataService:MasterDataService,
              private _snackBar: MatSnackBar,
              private alert:AlertcodesService) { }

  ngOnInit(): void {
    this.getMasterData();
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

  checkrolqbdetail(): boolean {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    if(user.rol == 'administrator' || user.rol == 'qb' || user.rol === 'cmsandqb'){
        return true;   
    }
    return false;
  }

  checkrolcmsdetail(): boolean {
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);

    if(user.rol == 'administrator' || user.rol == 'cms' || user.rol === 'cmsandqb'){
        return true;   
    }
    return false;
  }
  getMasterData()
  {
    this.masterDataService.getMasterData().pipe(
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

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openSnackBar(message: string) {
    this._snackBar.open("Comment: "+message, "Done");
  }
}
