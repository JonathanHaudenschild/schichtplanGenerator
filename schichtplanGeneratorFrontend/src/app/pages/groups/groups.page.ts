import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/store/schedule/schedule.model';
import { Store } from '@ngrx/store';
import { selectAllGroups } from 'src/app/store/schedule/schedule.selectors';
import { createGroup, getGroups, selectGroup } from 'src/app/store/schedule/schedule.actions';
import { ModalController } from '@ionic/angular';
import { GroupAddComponent } from 'src/app/components/main/group-add/group-add.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  groups$: Observable<Group[]> = this.store.select(selectAllGroups);
  public isOpenGroupModal = false;
  constructor(private store: Store, private modalCtrl: ModalController) { }


  ngOnInit(): void {

    this.store.dispatch(getGroups());
  }

  onGroupAdded(group: Group) {
    console.log(group);
    this.store.dispatch(createGroup({ group }));
  }

  onGroupSelected(group: Group) {
    console.log(group);
    this.store.dispatch(selectGroup({ group }));
  }

  openGroupAddModal(show: boolean): void {
    this.isOpenGroupModal = show;
  }
}