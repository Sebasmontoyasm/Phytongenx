import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MasterDataPageComponent } from './components/master-data-page/master-data-page.component';
import { SigninPageComponent } from './components/signin-page/signin-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CmsPageComponent } from './components/cms/cms-page/cms-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import { DialogdeletePageComponent } from './components/customs/dialogdelete-page/dialogdelete-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CmsPerformancePageComponent } from './components/cms/cms-performance-page/cms-performance-page.component';
import { QbPerformancePageComponent } from './components/qb/qb-performance-page/qb-performance-page.component';
import { QbPageComponent } from './components/qb/qb-page/qb-page.component';
import { CmsDetailPageComponent } from './components/cms/cms-detail-page/cms-detail-page.component';
import { QbDetailPageComponent } from './components/qb/qb-detail-page/qb-detail-page.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './components/customs/footer/footer.component';
import { NotFoundComponent } from './components/customs/not-found/not-found.component';
import { HeaderComponent } from './components/customs/header/header.component';
import { UsersPageComponent } from './components/users/users/usersPage.component';
import { AdministratorInterceptor } from './interceptors/admnistrator-interceptor';
import { UserCreatePageComponent } from './components/users/userCreatePage/userCreate-page.component';
import { MatSelectModule } from '@angular/material/select';
import { UsereditPageComponent } from './components/users/useredit-page/useredit-page.component';
import { DatePipe } from '@angular/common';
import { CmscreatePageComponent } from './components/cms/cmscreate-page/cmscreate-page.component';
import { UserslogsPageComponent } from './components/userslogs-page/userslogs-page.component';
import { RestorePageComponent } from './components/restore-page/restore-page.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ChangepassPageComponent } from './components/users/changepass-page/changepass-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MasterDataPageComponent,
    SigninPageComponent,
    CmsPageComponent,
    DialogdeletePageComponent,
    CmsPerformancePageComponent,
    QbPerformancePageComponent,
    QbPageComponent,
    CmsDetailPageComponent,
    QbDetailPageComponent,
    FooterComponent,
    NotFoundComponent,
    HeaderComponent,
    UsersPageComponent,
    UserCreatePageComponent,
    UsereditPageComponent,
    CmscreatePageComponent,
    UserslogsPageComponent,
    RestorePageComponent,
    ChangepassPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AdministratorInterceptor,
      multi:true
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
