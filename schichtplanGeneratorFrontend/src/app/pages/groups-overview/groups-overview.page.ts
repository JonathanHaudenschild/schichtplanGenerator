import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { Participant } from 'src/app/store/schedule/schedule.model';
import { Store } from '@ngrx/store';
import { selectAllParticipants } from 'src/app/store/schedule/schedule.selectors';
import { createParticipant, getGroupById, getParticipants, selectGroup, selectParticipant } from 'src/app/store/schedule/schedule.actions';
import { RouterReducerState } from '@ngrx/router-store';
import { selectRouteParams } from 'src/app/store/router/router.selector';

@Component({
  selector: 'app-groups-overview',
  templateUrl: './groups-overview.page.html',
  styleUrls: ['./groups-overview.page.scss'],
})
export class GroupsOverviewPage implements OnInit {
  participants$: Observable<Participant[]> = this.store.select(selectAllParticipants);
  public isOpenParticipantModal = false;

  constructor(private store: Store,
    private routerStore: Store<RouterReducerState>,) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.store.dispatch(getGroupById({
      groupId: await firstValueFrom(this.routerStore.select(selectRouteParams).pipe(
        tap((params) => console.log(params)),
        map((params) =>
          params['groupId'])))
    })
    )
  }



  onParticipantAdded(participant: Participant) {
    console.log(participant);
    this.store.dispatch(createParticipant({ participant }));
  }

  onParticipantSelected(participant: Participant) {
    console.log(participant);
    this.store.dispatch(selectParticipant({ participant }));
  }

  openParticipantAddModal(show: boolean): void {
    this.isOpenParticipantModal = show;
  }

}
