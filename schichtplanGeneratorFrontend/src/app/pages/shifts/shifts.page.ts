import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { Group, Shift } from 'src/app/store/schedule/schedule.model';
import { Store } from '@ngrx/store';
import { selectAllShifts, selectSelectedGroup } from 'src/app/store/schedule/schedule.selectors';
import { createShift, getGroupById, selectGroup, selectShift, updateShift } from 'src/app/store/schedule/schedule.actions';
import { RouterReducerState } from '@ngrx/router-store';
import { selectRouteParams } from 'src/app/store/router/router.selector';
@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.page.html',
  styleUrls: ['./shifts.page.scss'],
})
export class ShiftsPage implements OnInit {
  public groupId: number = 0;
  shifts$: Observable<Shift[]> = this.store.select(selectAllShifts).pipe(tap((shifts) => console.log(shifts)));
  group$: Observable<Group | null | undefined> = this.store.select(selectSelectedGroup)

  public isOpenShiftModal = false;
  public shift: Shift | null = null;
  public editMode = false;
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
  constructor(private store: Store,
    private routerStore: Store<RouterReducerState>,) { }

  ngOnInit() {
  }


  onShiftEdit(shift: Shift) {
    this.shift = shift;
    this.editMode = true;
    this.openShiftAddModal(true);
  }

  onShiftAdd(shift?: Shift) {
    this.shift = shift || null;
    console.log(shift, this.shift)
    this.editMode = false;
    this.openShiftAddModal(true);
  }

  onShiftEdited(shift: Shift) {
    console.log(shift);
    this.store.dispatch(updateShift({ shift }));
  }
  onShiftDelete(shift: Shift) {
    console.log(shift);
  }

  onShiftAdded(shift: Shift) {
    console.log(shift);
    this.store.dispatch(createShift({ shift }));
  }

  onShiftSelected(shift: Shift) {
    console.log(shift);
    this.store.dispatch(selectShift({ shift }));
  }

  openShiftAddModal(show: boolean): void {
    this.isOpenShiftModal = show;
  }
}
