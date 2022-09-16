import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MasterDataPageComponent } from './components/master-data-page/master-data-page.component';
import { SinginPageComponent } from './components/singin-page/singin-page.component'; 
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CmsPageComponent } from './components/cms-page/cms-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';
import { DialogdeletePageComponent } from './components/dialogdelete-page/dialogdelete-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CmsPerformancePageComponent } from './components/cms-performance-page/cms-performance-page.component';
import { QbPerformancePageComponent } from './components/qb-performance-page/qb-performance-page.component';
import { QbPageComponent } from './components/qb-page/qb-page.component';
import { CmsDetailPageComponent } from './components/cms-detail-page/cms-detail-page.component';
import { QbDetailPageComponent } from './components/qb-detail-page/qb-detail-page.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MasterDataPageComponent,
    SinginPageComponent,
    CmsPageComponent,
    DialogdeletePageComponent,
    CmsPerformancePageComponent,
    QbPerformancePageComponent,
    QbPageComponent,
    CmsDetailPageComponent,
    QbDetailPageComponent,
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
    BrowserAnimationsModule
  ],
  providers: [MatDatepickerModule,
    MatNativeDateModule],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
