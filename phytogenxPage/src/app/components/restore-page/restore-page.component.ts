import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestoreService} from 'src/app/services/restore/restore.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Data } from 'src/app/interfaces/data/data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restore-page',
  templateUrl: './restore-page.component.html',
  styleUrls: ['./restore-page.component.css']
})
export class RestorePageComponent implements OnInit,OnDestroy {

  private destroy = new Subject<any>();

  id: any;

  title = 'data-table';
  displayedColumn: string[] =['id','MDID','PO_Number','Date_CSM_Processed','PDF_Name','NamePDF','Invoice_Number','action','Date_invoice_recieved','Date_Quickbooks_Processed','date_action'];
  dataSource!: MatTableDataSource<Data>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private restoreService:RestoreService,
              private router: Router) { }
 

  ngOnInit(): void {
    this.getRestoreData();
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getRestoreData(){
    this.restoreService.getAll().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;        
      },
      error => {
        console.log("Something wrong, it can't get Data \n "+error);
      }
    );
  }
  Logs(){
    this.router.navigate(['/userslogs']);
  }
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
