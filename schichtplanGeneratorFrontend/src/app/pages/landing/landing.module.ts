import { NgModule } from '@angular/core';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';
import { LandingFeatureModule } from 'src/app/components/landing/landing-feature.module';

@NgModule({
  imports: [
    LandingFeatureModule,
    LandingPageRoutingModule
  ],
  declarations: [LandingPage]
})
export class LandingPageModule {}
