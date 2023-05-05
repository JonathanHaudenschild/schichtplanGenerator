import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, tap } from 'rxjs';
import { selectRouteParams } from 'src/app/store/router/router.selector';
import { getGroupById } from 'src/app/store/schedule/schedule.actions';


@Component({
  selector: 'app-groups-overview',
  templateUrl: './groups-overview.page.html',
  styleUrls: ['./groups-overview.page.scss'],
})
export class GroupsOverviewPage implements OnInit {
  private groupId: number = 0;
  async ionViewWillEnter() {
    this.groupId = await firstValueFrom(this.routerStore.select(selectRouteParams).pipe(
      tap((params) => console.log(params)),
      map((params) =>
        params['groupId'])))

    this.store.dispatch(getGroupById({
      groupId: this.groupId
    })
    )
  }
  constructor(
    private store: Store,
    private routerStore: Store<RouterReducerState>,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  goToParticipantsPage() {
    this.navCtrl.navigateForward(`/groups/${this.groupId}/participants`);
  }

  goToShiftsPage() {
    this.navCtrl.navigateForward(`/groups/${this.groupId}/shifts`);
  }
}
