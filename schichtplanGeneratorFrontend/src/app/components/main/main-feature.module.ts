import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { ParticipantsAddComponent } from './participants-add/participants-add.component';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { ShiftAddComponent } from './shift-add/shift-add.component';
import { ShiftsOverviewComponent } from './shifts-overview/shifts-overview.component';

@NgModule({
    imports: [SharedModule],
    declarations: [GroupsListComponent, GroupAddComponent, ParticipantsAddComponent, ParticipantsListComponent, ShiftAddComponent, ShiftsOverviewComponent],
    exports: [SharedModule, GroupsListComponent, GroupAddComponent, ParticipantsAddComponent, ParticipantsListComponent, ShiftAddComponent, ShiftsOverviewComponent],
})
export class MainFeatureModule { }
