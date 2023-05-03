import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./pages/groups/groups.module').then(m => m.GroupsPageModule)
  },
  {
    path: 'participants',
    loadChildren: () => import('./pages/participants/participants.module').then(m => m.ParticipantsPageModule)
  },
  {
    path: 'shifts',
    loadChildren: () => import('./pages/shifts/shifts.module').then(m => m.ShiftsPageModule)
  },
  {
    path: 'groups/:groupId',
    loadChildren: () => import('./pages/groups-overview/groups-overview.module').then(m => m.GroupsOverviewPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
