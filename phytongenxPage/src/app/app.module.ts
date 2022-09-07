import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AddFacturaPageComponent } from './components/add-factura-page/add-factura-page.component';
import { EditFacturaPageComponent } from './components/edit-factura-page/edit-factura-page.component';
import { GetFacturaPageComponent } from './components/get-factura-page/get-factura-page.component';
import { SinginPageComponent } from './components/singin-page/singin-page.component'; 
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UpdatecmdPageComponent } from './components/updatecmd-page/updatecmd-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';
import { DialogdeletePageComponent } from './components/dialogdelete-page/dialogdelete-page.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AddFacturaPageComponent,
    EditFacturaPageComponent,
    GetFacturaPageComponent,
    SinginPageComponent,
    UpdatecmdPageComponent,
    DialogdeletePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    MatDialogModule
  ],
  providers: [MatDatepickerModule,
    MatNativeDateModule],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
