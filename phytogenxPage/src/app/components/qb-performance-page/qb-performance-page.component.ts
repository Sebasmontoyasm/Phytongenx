import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QbService } from 'src/app/services/qb.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { QbPerformance } from 'src/app/interfaces/qb-performance';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qb-performance-page',
  templateUrl: './qb-performance-page.component.html',
  styleUrls: ['./qb-performance-page.component.css']
})
export class QbPerformancePageComponent implements OnInit {

  title = 'data-table';
  displayedColumn: string[] =['ID','LastDate','InvoiceNumber','Tries','LastPO','State'];
  dataSource!: MatTableDataSource<QbPerformance>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private qbService:QbService,
              private router: Router) { }

  ngOnInit(): void {
    this.getQbPerformace();
  }

  getQbPerformace()
  {
    this.qbService.performace().subscribe(
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
  
  onReturn(){
    this.router.navigate(['/masterdata']);
  }
}
