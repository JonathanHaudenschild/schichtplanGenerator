import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Participant } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss'],
})
export class ParticipantsListComponent  implements OnInit {
  @Input() participants: Participant[] | null = [];
  @Output() participantSelected = new EventEmitter<Participant>();
  constructor() { }

  ngOnInit() { }

  onParticipantSelected(participant: Participant) {
    console.log(participant)
    this.participantSelected.emit(participant);
  }

}