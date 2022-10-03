import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user/user.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user/user';
import { DialogdeletePageComponent } from '../../customs/dialogdelete-page/dialogdelete-page.component';
import { MatDialog } from '@angular/material/dialog';
import { UserLog } from 'src/app/interfaces/user/userlog';

@Component({
  selector: 'app-users',
  templateUrl: './usersPage.component.html',
  styleUrls: ['./usersPage.component.css']
})
export class UsersPageComponent implements OnInit,OnDestroy {

  displayedColumn: string[] =['id','name','username','rol','createdAt','UpdateAt','Action'];
  dataSource!: MatTableDataSource<User>;
  posts:any;
  rol = "guest";
  deleteID = 0;
  private destroy = new Subject<any>();

  usrlog: UserLog = {
    user: 1,
    rol: "Tester",
    action: "Delete User",
    dateaction: "3/10/2022",
    iddata: 0,
    idpo: 0,
    idinvoce: 0,
    comments: "Automatic process",    
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  constructor(private userService:UserService,
    private _snackBar: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsers();
    this.rol = this.checkrol();
  }

  checkrol(){
    const localitem: string | any = localStorage.getItem('user');
    const user = JSON.parse(localitem);
    return user.rol;
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  getUsers()
  {
    this.userService.getAll().pipe(
      takeUntil(this.destroy)
    ).subscribe(
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

  onUserDeleteID(id: number){
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

}
