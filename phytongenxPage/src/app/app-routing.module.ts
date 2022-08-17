import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFacturaPageComponent } from './components/add-factura-page/add-factura-page.component';
import { EditFacturaPageComponent } from './components/edit-factura-page/edit-factura-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';

const routes: Routes = [
  { path:'', redirectTo:'/HomePage', pathMatch:'full'},
  { path:'HomePage', component: HomePageComponent},
  { path:'add', component: AddFacturaPageComponent},
  { path:'edit', component: EditFacturaPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
