import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MasterDataService } from 'src/app/services/masterdata.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from 'src/app/interfaces/data';

@Component({
  selector: 'app-master-data-page',
  templateUrl: './master-data-page.component.html',
  styleUrls: ['./master-data-page.component.css']
})

export class MasterDataPageComponent implements OnInit {
  
  title = 'data-table';
  displayedColumn: string[] =['ID','PO_Number','Date_CSM_Processed','PDF_Name','NamePDF','Invoice_Number','Date_invoice_recieved','Date_Quickbooks_Processed','DelayQb','DaysSince'];
  dataSource!: MatTableDataSource<Data>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;
  delayProcess:any;
  invsNumber:any;
  arrayList:Array<number> = [];

  constructor(private masterDataService:MasterDataService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMasterData();
  }

  getMasterData()
  {
    this.masterDataService.getMasterData().subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.log("Error: "+err)
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
