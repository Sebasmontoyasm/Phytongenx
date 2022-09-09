import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MasterDataService } from 'src/app/services/masterdata.service';
import { MatMenuTrigger } from '@angular/material/menu';

export interface data{
  id:string;
  po_number: string;
  dateCSM: string;
  namePO: string;
  invoice: string;
  dateQP: string;
  dateInv: string;
  PDA_pdf: string;
}

@Component({
  selector: 'app-master-data-page',
  templateUrl: './master-data-page.component.html',
  styleUrls: ['./master-data-page.component.css']
})

export class MasterDataPageComponent implements OnInit {
  
  title = 'data-table';
  displayedColumn: string[] =['ID','PO_Number','Date_CSM_Processed','PDF_Name','NamePDF','Invoice_Number','Date_invoice_recieved','Date_Quickbooks_Processed'];
  dataSource!: MatTableDataSource<data>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private MasterDataService:MasterDataService) { }

  ngOnInit(): void {
    this.getMasterData();
  }

  getMasterData()
  {
    this.MasterDataService.getMasterData().subscribe(
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

  menuTigger(event: Event) {
    console.log("Evento Menu:"+event);
    //this.trigger.openMenu();
  }
}
