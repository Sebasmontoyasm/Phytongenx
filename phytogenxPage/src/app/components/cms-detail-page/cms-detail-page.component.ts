import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CmsService } from 'src/app/services/cms.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { CmsDetail } from 'src/app/interfaces/cms-detail';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-cms-detail-page',
  templateUrl: './cms-detail-page.component.html',
  styleUrls: ['./cms-detail-page.component.css']
})
export class CmsDetailPageComponent implements OnInit {
  id: any;
  title = 'data-table';
  displayedColumn: string[] =['ID','Date','PDFName','PONumber','SubloteCode','Test','State'];
  dataSource!: MatTableDataSource<CmsDetail>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  
  posts:any;

  constructor(private cmsService:CmsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.getCmsDetail();
  }

  getCmsDetail()
  {
    this.route.params.subscribe(params => {
      this.id = Object.values(params);
    });

    this.cmsService.detail(this.id[0]).subscribe(
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
