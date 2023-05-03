import { NgModule } from '@angular/core';


import { GroupsOverviewPageRoutingModule } from './groups-overview-routing.module';

import { GroupsOverviewPage } from './groups-overview.page';
import { MainFeatureModule } from 'src/app/components/main/main-feature.module';

@NgModule({
  imports: [
    MainFeatureModule,
    GroupsOverviewPageRoutingModule
  ],
  declarations: [GroupsOverviewPage]
})
export class GroupsOverviewPageModule { }
