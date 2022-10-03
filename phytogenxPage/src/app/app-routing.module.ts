import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterDataPageComponent } from './components/master-data-page/master-data-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CmsPageComponent } from './components/cms/cms-page/cms-page.component';
import { CmsPerformancePageComponent } from './components/cms/cms-performance-page/cms-performance-page.component';
import { QbPageComponent } from './components/qb/qb-page/qb-page.component';
import { QbPerformancePageComponent } from './components/qb/qb-performance-page/qb-performance-page.component';
import { CmsDetailPageComponent } from './components/cms/cms-detail-page/cms-detail-page.component';
import { QbDetailPageComponent } from './components/qb/qb-detail-page/qb-detail-page.component';
import { UsersPageComponent } from './components/users/users/usersPage.component';
import { CheckSinginGuard } from './guards/singin/check-singin.guard';
import { NotFoundComponent } from './components/customs/not-found/not-found.component';
import { CheckRolGuard } from './guards/rol/check-rol.guard';

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
  { path:'users',canActivate:[CheckSinginGuard, CheckRolGuard], component: UsersPageComponent},
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
