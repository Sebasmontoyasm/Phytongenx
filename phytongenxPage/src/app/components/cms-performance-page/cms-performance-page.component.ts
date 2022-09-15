import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService } from 'src/app/services/cms.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CmsPerformance } from 'src/app/interfaces/cms-performance'

@Component({
  selector: 'app-cms-performance-page',
  templateUrl: './cms-performance-page.component.html',
  styleUrls: ['./cms-performance-page.component.css']
})
export class CmsPerformancePageComponent implements OnInit {

  title = 'data-table';
  displayedColumn: string[] =['PDFName','PONumber','DateStart','DateEnd','CountPO','CountSublote','TestCount','CountIssue'];
  dataSource!: MatTableDataSource<CmsPerformance>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private cmsService:CmsService) { }

  ngOnInit(): void {
    this.getCmsPerformace();
  }

  getCmsPerformace()
  {
    this.cmsService.performace().subscribe(
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
}
