import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from 'src/app/store/schedule/schedule.model';
import { ModalController } from '@ionic/angular';
import { GroupAddComponent } from '../group-add/group-add.component';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit {
  @Input() groups: Group[] | null = [];
  @Output() groupSelected = new EventEmitter<Group>();
  @Output() groupEdit = new EventEmitter<Group>();
  @Output() groupDelete = new EventEmitter<Group>();
  constructor() { }

  ngOnInit() { }

  onGroupSelected(group: Group) {
    this.groupSelected.emit(group);
  }
  onEditGroup(group: Group) {
    this.groupEdit.emit(group);
  }

  onDeleteGroup(group: Group) {
    this.groupDelete.emit(group);
  }

}
