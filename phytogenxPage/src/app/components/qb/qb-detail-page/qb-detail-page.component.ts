import { Component, OnInit,OnDestroy, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QbService } from 'src/app/services/qb/qb.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { QbDetail } from 'src/app/interfaces/qb/qb-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-qb-detail-page',
  templateUrl: './qb-detail-page.component.html',
  styleUrls: ['./qb-detail-page.component.css']
})
export class QbDetailPageComponent implements OnInit, OnDestroy {
  params: any = '';
  title = 'data-table';
  displayedColumn: string[] =['ID','Date','PONumber','InvoiceNumber','State'];
  dataSource!: MatTableDataSource<QbDetail>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  private destroy = new Subject<any>();

  constructor(private qbService:QbService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.getQbDetail();
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getQbDetail()
  {
    this.route.params.pipe(
        takeUntil(this.destroy)
      ).subscribe(params => {
        this.params = Object.values(params);
      },
      err => {
        console.log("Error with get invoice detail \n"+err);
      }
    );

    this.qbService.detail(this.params[0]).pipe(
        takeUntil(this.destroy)
      ).subscribe(
        res=>{
          this.posts=res;
          this.dataSource = new MatTableDataSource(this.posts);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => {
          console.log("Something wrong, it can't get Data \n "+error)
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
