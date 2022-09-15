import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService} from 'src/app/services/cms.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogdeletePageComponent } from '../dialogdelete-page/dialogdelete-page.component';

export interface Cms{
  id:string;
  po_number: string;
}


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

const COLUMNS_SCHEMA = [
  { key: 'ID', type: 'text', label: 'ID'},
  { key: 'PO_NUMBER', type: 'text', label: 'PO_NUMBER'},
  { key: 'Reason', type: 'text', pattern:"[A-Za-z0-9]", label: 'Reason'},
  { key: 'Other', type: 'text', pattern:"[A-Za-z0-9]", label: 'Other'},
  { key: 'Date_CSM_Processed', type: 'date', pattern:"[A-Za-z0-9]", label: 'Date CSM Processed'},
  { key: 'Upload_PDF', type: 'button', label: 'Cargar PDF'},
  { key: 'Action', type: 'button', label: 'Action'}
];

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.component.html',
  styleUrls: ['./cms-page.component.css']
})

export class CmsPageComponent implements OnInit {

  title = 'data-table';

  dataSource!: MatTableDataSource<Cms>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsSchema: any = COLUMNS_SCHEMA;
  posts:any = [];
  displayedColumn: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  
  fileName = '';
  reason: string = "";

  public deleteID = 0; 

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
  
  constructor(private cmsService:CmsService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCms();
  }

  getCms()
  {
    this.cmsService.manually().subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.log("Error CMS View: "+err)
    );
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  chooseFile(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(filterValue);
  }


  getDeleteID(id: number){
    this.deleteID = id;
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(DialogdeletePageComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data:{ id: this.deleteID, userlog: this.usrlog}
    });
  }

  observerReasonOpt(id: number){
    console.log("Click Option: "+id);    
  }
}


