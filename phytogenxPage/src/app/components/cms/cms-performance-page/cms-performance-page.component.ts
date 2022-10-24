import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService } from 'src/app/services/cms/cms.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CmsPerformance } from 'src/app/interfaces/cms/cms-performance'
import { Router } from '@angular/router';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cms-performance-page',
  templateUrl: './cms-performance-page.component.html',
  styleUrls: ['./cms-performance-page.component.css']
})
export class CmsPerformancePageComponent implements OnInit, OnDestroy {

  private destroy = new Subject<any>();

  title = 'data-table';
  displayedColumn: string[] =['PDFName','PONumber','DateStart','DateEnd','CountPO','CountSublote','TestCount','CountIssue'];
  dataSource!: MatTableDataSource<CmsPerformance>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private cmsService:CmsService,
              private router: Router,
              private alert: AlertcodesService) { }

  ngOnInit(): void {
    this.getCmsPerformace();
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getCmsPerformace()
  {
    this.cmsService.performace().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        this.posts=res;
        this.dataSource = new MatTableDataSource(this.posts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error =>{
        this.alert.alertMessage(error[0],error[1])
      }
    );
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onReturn(){
    this.router.navigate(['/masterdata']);
  }
}
