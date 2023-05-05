import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { Shift } from 'src/app/store/schedule/schedule.model';
import { Store } from '@ngrx/store';
import { selectAllShifts } from 'src/app/store/schedule/schedule.selectors';
import { createShift, getGroupById, selectShift, updateShift } from 'src/app/store/schedule/schedule.actions';
import { RouterReducerState } from '@ngrx/router-store';
import { selectRouteParams } from 'src/app/store/router/router.selector';
@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.page.html',
  styleUrls: ['./shifts.page.scss'],
})
export class ShiftsPage implements OnInit {
  shifts$: Observable<Shift[]> = this.store.select(selectAllShifts).pipe(tap((shifts) => console.log(shifts)));
  public isOpenShiftModal = false;
  public shift: Shift | null = null;
  public editMode = false;

  constructor(private store: Store,
    private routerStore: Store<RouterReducerState>,) { }

  ngOnInit() {
  }


  onShiftEdit(shift: Shift) {
    this.shift = shift;
    this.editMode = true;
    this.openShiftAddModal(true);
  }

  onShiftAdd() {
    this.shift = null;
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
