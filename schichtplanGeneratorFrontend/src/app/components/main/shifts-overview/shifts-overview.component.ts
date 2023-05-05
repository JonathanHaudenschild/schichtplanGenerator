import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Shift } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-shifts-overview',
  templateUrl: './shifts-overview.component.html',
  styleUrls: ['./shifts-overview.component.scss'],
})
export class ShiftsOverviewComponent  implements OnInit {
  @Input() shifts: Shift[] | null = [];
  @Output() shiftSelected = new EventEmitter<Shift>();
  @Output() shiftEdit = new EventEmitter<Shift>();
  @Output() shiftDelete = new EventEmitter<Shift>();

  constructor() {}

  ngOnInit() {}

  onShiftSelected(shift: Shift) {
    console.log(shift);
    this.shiftSelected.emit(shift);
  }

  onEditShift(shift: Shift) {
    this.shiftEdit.emit(shift);
  }

  onDeleteShift(shift: Shift) {
    this.shiftDelete.emit(shift);
  }
}