import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { effects, getMetaReducers, metaReducers, reducers } from './store';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule, META_REDUCERS } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StorageService } from './services/storage.service';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RouterModule.forRoot([
      // routes
    ]),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot(effects)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {
    provide: META_REDUCERS,
    deps: [StorageService],
    useFactory: getMetaReducers,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
