import { Component, OnInit, ViewChild,OnDestroy} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserlogService } from 'src/app/services/userlog/userlog.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserLog } from 'src/app/interfaces/user/userlog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userslogs-page',
  templateUrl: './userslogs-page.component.html',
  styleUrls: ['./userslogs-page.component.css']
})
export class UserslogsPageComponent implements OnInit, OnDestroy {

  title = 'data-table';
  private destroy = new Subject<any>();
  displayedColumn: string[] =['id','restore','username','rol','reason','action','date_action'];
  dataSource!: MatTableDataSource<UserLog>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  posts:any;

  constructor(private userlogService: UserlogService,
              private router: Router) { }

  ngOnInit(): void {
    this.getUserlogs();
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getUserlogs()
  {
    this.userlogService.getAll().pipe(
      takeUntil(this.destroy)
    ).subscribe(
      res=>{
        console.log("userlog: ",res);
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

  onRestore(){
    this.router.navigate(['/restore']);
  }

}
