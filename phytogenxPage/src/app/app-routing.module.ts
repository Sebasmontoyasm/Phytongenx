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
import { CheckSinginGuard } from './guards/check-singin.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CheckRolGuard } from './guards/check-rol.guard';

const routes: Routes = [
  { path:'', redirectTo:'/homepage', pathMatch:'full'},
  { path:'homepage', component: HomePageComponent},
  { path:'masterdata',canActivate:[CheckSinginGuard, CheckRolGuard], component: MasterDataPageComponent},
  { path:'cms',canActivate:[CheckSinginGuard, CheckRolGuard], component: CmsPageComponent},
  { path:'cms/performance',canActivate:[CheckSinginGuard, CheckRolGuard], component: CmsPerformancePageComponent},
  { path:'cms/detail/:id?',canActivate:[CheckSinginGuard, CheckRolGuard], component: CmsDetailPageComponent},
  { path:'qb',canActivate:[CheckSinginGuard, CheckRolGuard], component: QbPageComponent},
  { path:'qb/performance',canActivate:[CheckSinginGuard, CheckRolGuard], component: QbPerformancePageComponent},
  { path:'qb/detail/:id?',canActivate:[CheckSinginGuard, CheckRolGuard], component: QbDetailPageComponent},
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
