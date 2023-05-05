import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { eachDayOfInterval, isWithinInterval, set } from 'date-fns';
import { Group, Shift } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-shifts-overview',
  templateUrl: './shifts-overview.component.html',
  styleUrls: ['./shifts-overview.component.scss'],
})
export class ShiftsOverviewComponent implements OnInit {
  @Input() group: Group | null | undefined = null;
  @Input() shifts: Shift[] | null = [];
  @Output() shiftSelected = new EventEmitter<Shift>();
  @Output() shiftEdit = new EventEmitter<Shift>();
  @Output() shiftAdd = new EventEmitter<Shift>();
  @Output() shiftDelete = new EventEmitter<Shift>();

  constructor() { }

  ngOnInit() { }

  onShiftSelected(shift: Shift) {
    console.log(shift);
    this.shiftSelected.emit(shift);
  }

  onEditShift(shift: Shift) {
    this.shiftEdit.emit(shift);
  }

  onAddShift(shift: Shift) {
    this.shiftAdd.emit(shift);
  }

  onDeleteShift(shift: Shift) {
    this.shiftDelete.emit(shift);
  }


  onCellClick(day: Date, timeSlot: Date) {
    // Handle cell click event to add a new shift or edit an existing one.
    console.log(`Clicked on ${day} - ${timeSlot}`);

    const shift = this.getShift(day, timeSlot);
    if (shift) {
      this.onEditShift(shift);
    }
    else {
      const newShift: Shift = {
        _id: 0,
        group: this.group || null,
        startDate: new Date(day.getFullYear(), day.getMonth(), day.getDate(), timeSlot.getHours(), 0, 0),
        endDate: new Date(day.getFullYear(), day.getMonth(), day.getDate(), timeSlot.getHours() + 1, 0, 0),
        shiftName: 'New Shift',
        description: '',
        participants: [],
        category: 0,
        type: 0,
        experienceLevel: 0,
        config: {
          isLocked: false,
          disableSwap: false,
          minParticipants: 1,
          maxParticipants: 10,
          minSupervisors: 1,
          maxSupervisors: 2,
        }
      }
      this.onAddShift(newShift);
    }

  }

  getDays(): Date[] {
    if (!this.group) {
      return [];
    }
    const days = eachDayOfInterval({
      start: new Date(this.group.startDate),
      end: new Date(this.group.endDate)
    })
    return days;
  }
  getTimeSlots(): Date[] {
    // Adjust the time slot intervals and format as needed.
    const slots: Date[] = [];
    const currentDate = new Date();
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    for (let i = 0; i < 24; i++) {
      const slot = new Date(currentDate);
      slot.setHours(i);
      slots.push(slot);
    }

    return slots;
  }



  getShift(day: Date, timeSlot: Date) {

    if (!this.shifts) {
      return null;
    }
    const shift = this.shifts.find(
      (shift) => {
        return day.getDate() === new Date(shift.startDate).getDate() &&
          this.isWithinHours(shift.startDate, shift.endDate)
      })


    return shift || null;
  }

  isWithinHours(start: Date, end: Date) {
    const time = new Date().getHours(); // The hour you want to check
    const startTime = new Date(start).getHours();
    const endTime = new Date(end).getHours();

    const referenceDate = new Date(2000, 0, 1); // You can set any arbitrary date as a reference

    return isWithinInterval(set(referenceDate, { hours: time }), {
      start: set(referenceDate, { hours: startTime }),
      end: set(referenceDate, { hours: endTime }),
    });

  }

}