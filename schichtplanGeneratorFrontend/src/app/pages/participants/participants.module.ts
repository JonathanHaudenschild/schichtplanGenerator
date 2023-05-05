import { NgModule } from '@angular/core';


import { ParticipantsPageRoutingModule } from './participants-routing.module';

import { ParticipantsPage } from './participants.page';
import { MainFeatureModule } from 'src/app/components/main/main-feature.module';

@NgModule({
  imports: [
    MainFeatureModule,
    ParticipantsPageRoutingModule
  ],
  declarations: [ParticipantsPage]
})
export class ParticipantsPageModule {}
