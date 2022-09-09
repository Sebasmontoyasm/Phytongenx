import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterDataPageComponent } from './components/master-data-page/master-data-page.component';
import { SinginPageComponent } from './components/singin-page/singin-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CmsPageComponent } from './components/cms-page/cms-page.component';

const routes: Routes = [
  { path:'', redirectTo:'/HomePage', pathMatch:'full'},
  { path:'HomePage', component: HomePageComponent},
  { path:'get', component: MasterDataPageComponent},
  { path:'singin', component: SinginPageComponent},
  { path:'cms', component: CmsPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
