import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterDataPageComponent } from './components/master-data-page/master-data-page.component';
import { SinginPageComponent } from './components/singin-page/singin-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CmsPageComponent } from './components/cms-page/cms-page.component';
import { CmsPerformancePageComponent } from './components/cms-performance-page/cms-performance-page.component';
import { QbPageComponent } from './components/qb-page/qb-page.component';
import { QbPerformancePageComponent } from './components/qb-performance-page/qb-performance-page.component';
import { CmsDetailPageComponent } from './components/cms-detail-page/cms-detail-page.component';
import { QbDetailPageComponent } from './components/qb-detail-page/qb-detail-page.component';

const routes: Routes = [
  { path:'', redirectTo:'/HomePage', pathMatch:'full'},
  { path:'HomePage', component: HomePageComponent},
  { path:'get', component: MasterDataPageComponent},
  { path:'singin', component: SinginPageComponent},
  { path:'cms', component: CmsPageComponent},
  { path:'cms/performance', component: CmsPerformancePageComponent},
  { path:'cms/detail/:id?', component: CmsDetailPageComponent},
  { path:'qb', component: QbPageComponent},
  { path:'qb/performance', component: QbPerformancePageComponent},
  { path:'qb/detail/:id?', component: QbDetailPageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
