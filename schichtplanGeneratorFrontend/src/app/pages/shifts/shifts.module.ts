import { NgModule } from '@angular/core';

import { ShiftsPageRoutingModule } from './shifts-routing.module';

import { ShiftsPage } from './shifts.page';
import { MainFeatureModule } from 'src/app/components/main/main-feature.module';

@NgModule({
  imports: [
    MainFeatureModule,
    ShiftsPageRoutingModule
  ],
  declarations: [ShiftsPage]
})
export class ShiftsPageModule {}
