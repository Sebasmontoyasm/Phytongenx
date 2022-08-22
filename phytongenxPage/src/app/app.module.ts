import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AddFacturaPageComponent } from './components/add-factura-page/add-factura-page.component';
import { EditFacturaPageComponent } from './components/edit-factura-page/edit-factura-page.component';
import { GetFacturaPageComponent } from './components/get-factura-page/get-factura-page.component';
import { SinginPageComponent } from './components/singin-page/singin-page.component'; 

import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AddFacturaPageComponent,
    EditFacturaPageComponent,
    GetFacturaPageComponent,
    SinginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
