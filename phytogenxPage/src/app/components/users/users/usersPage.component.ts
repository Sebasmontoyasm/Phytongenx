import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user/user.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user/user';
import { DialogdeletePageComponent } from '../../customs/dialogdelete-page/dialogdelete-page.component';
import { MatDialog } from '@angular/material/dialog';
import { UserCreatePageComponent } from '../userCreatePage/userCreate-page.component';
import { UsereditPageComponent } from '../useredit-page/useredit-page.component';
import { Overlay } from '@angular/cdk/overlay';
import { AlertcodesService } from 'src/app/services/alerts/alertcodes.service';

@Component({
  selector: 'app-users',
  templateUrl: './usersPage.component.html',
  styleUrls: ['./usersPage.component.css']
})
export class UsersPageComponent implements OnInit,OnDestroy {

  displayedColumn: string[] =['id','name','username','rol','createdAt','UpdateAt','Actions'];
  dataSource!: MatTableDataSource<User>;
  posts:any;
  rol = "guest";
  private destroy = new Subject<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  constructor(private userService:UserService,
    private dialog: MatDialog,
    private overlay:Overlay,
    private warningAlert: AlertcodesService) { }

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
      err => {
        this.warningAlert.alertMessage(err[0],err[1]);
      }
    );
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(UserCreatePageComponent, {
      position: {top: '130px'},
      width: '30%',
      height: '72%',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }

  openEditDialog(user = {},enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(UsereditPageComponent, {
      position: {top: '130px'},
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      width: '30%',
      height: '68%',
      enterAnimationDuration,
      exitAnimationDuration,
      data:{user:user}
    });
  }

  openDeleteDialog(id:number,enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogdeletePageComponent, {
    width: '250px',
    enterAnimationDuration,
    exitAnimationDuration,
    data:{ id,title:'users'}
    });
  }
}
