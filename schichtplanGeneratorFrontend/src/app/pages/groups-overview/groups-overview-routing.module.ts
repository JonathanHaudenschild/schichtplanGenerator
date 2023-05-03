import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupsOverviewPage } from './groups-overview.page';

const routes: Routes = [
  {
    path: '',
    component: GroupsOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsOverviewPageRoutingModule {}
