import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit {
  @Input() groups: Group[] | null = [];
  @Output() groupSelected = new EventEmitter<Group>();
  constructor() { }

  ngOnInit() { }

  onGroupSelected(group: Group) {
    this.groupSelected.emit(group);
  }

}
