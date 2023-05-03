import { NgModule } from '@angular/core';


import { GroupsPageRoutingModule } from './groups-routing.module';

import { GroupsPage } from './groups.page';
import { MainFeatureModule } from 'src/app/components/main/main-feature.module';

@NgModule({
  imports: [
    MainFeatureModule,
    GroupsPageRoutingModule
  ],
  declarations: [GroupsPage]
})
export class GroupsPageModule {}
