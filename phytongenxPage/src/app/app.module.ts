import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AddFacturaPageComponent } from './components/add-factura-page/add-factura-page.component';
import { EditFacturaPageComponent } from './components/edit-factura-page/edit-factura-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AddFacturaPageComponent,
    EditFacturaPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
