import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QbService } from 'src/app/services/qb.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { QbDetail } from 'src/app/interfaces/qb-detail';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-qb-detail-page',
  templateUrl: './qb-detail-page.component.html',
  styleUrls: ['./qb-detail-page.component.css']
})
export class QbDetailPageComponent implements OnInit {
  id: any;
  title = 'data-table';
  displayedColumn: string[] =['ID','Date','PONumber','InvoiceNumber','State'];
  dataSource!: MatTableDataSource<QbDetail>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private qbService:QbService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getQbDetail();
  }

  getQbDetail()
  {
    this.route.params.subscribe(params => {
      this.id = Object.values(params);
    });

    this.qbService.detail(this.id[0]).subscribe(
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
