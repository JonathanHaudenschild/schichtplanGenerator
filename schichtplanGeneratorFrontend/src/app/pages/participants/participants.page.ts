import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { Participant } from 'src/app/store/schedule/schedule.model';
import { Store } from '@ngrx/store';
import { selectAllParticipants } from 'src/app/store/schedule/schedule.selectors';
import { createParticipant, getGroupById, selectParticipant, updateParticipant } from 'src/app/store/schedule/schedule.actions';
import { RouterReducerState } from '@ngrx/router-store';
import { selectRouteParams } from 'src/app/store/router/router.selector';
@Component({
  selector: 'app-participants',
  templateUrl: './participants.page.html',
  styleUrls: ['./participants.page.scss'],
})
export class ParticipantsPage implements OnInit {
  participants$: Observable<Participant[]> = this.store.select(selectAllParticipants);
  public isOpenParticipantModal = false;
  public participant: Participant | null = null;
  public editMode = false;

  constructor(private store: Store,
    private routerStore: Store<RouterReducerState>,) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    
  }
  onParticipantEdit(participant: Participant) {
    this.participant = participant;
    this.editMode = true;
    this.openParticipantAddModal(true);
  }

  onParticipantAdd() {
    this.participant = null;
    this.editMode = false;
    this.openParticipantAddModal(true);
  }

  onParticipantEdited(participant: Participant) {
    console.log(participant);
    this.store.dispatch(updateParticipant({ participant }));
  }
  onParticipantDelete(participant: Participant) {
    console.log(participant);
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
