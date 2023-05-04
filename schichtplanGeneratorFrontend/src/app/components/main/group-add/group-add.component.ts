import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { roundToNearestMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Group } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss'],
})
export class GroupAddComponent implements OnChanges {
  @Output() groupAdded = new EventEmitter<Group>();
  @Output() groupEdited = new EventEmitter<Group>();
  @Input() group: Group | null = null;
  @Input() isEdit: boolean = false;
  groupForm: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes) {
      return;
    }
    if (changes['group'].currentValue) {
      this.groupForm.patchValue({
        groupName: changes['group'].currentValue.groupName,
        startDate: changes['group'].currentValue.startDate,
        endDate: changes['group'].currentValue.endDate,
        allowSwapping: changes['group'].currentValue.config.allowSwapping,
        numberOfShiftsPerDay: changes['group'].currentValue.config.numberOfShiftsPerDay,
        numberOfOffDays: changes['group'].currentValue.config.numberOfOffDays,
        participantsPerShift: {
          lower: changes['group'].currentValue.config.minParticipantsPerShift,
          upper: changes['group'].currentValue.config.maxParticipantsPerShift,
        },
        supervisorsPerShift: {
          lower: changes['group'].currentValue.config.minSupervisorsPerShift,
          upper: changes['group'].currentValue.config.maxSupervisorsPerShift,
        }
      });
    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }


  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    const currentDate = new Date();
    const startDate = roundToNearestMinutes(new Date(
      currentDate.setMinutes(
        currentDate.getMinutes() - currentDate.getTimezoneOffset()
      )
    ), { nearestTo: 15, roundingMethod: 'ceil' }).toISOString();

    const endDate = roundToNearestMinutes(currentDate, { nearestTo: 15, roundingMethod: 'ceil' }).toISOString();
    this.groupForm = this.fb.group({
      groupName: [this.group?.groupName ?? '', Validators.required],
      startDate: [startDate, Validators.required],
      endDate: [endDate, Validators.required],
      allowSwapping: [this.group?.config.allowSwapping ?? false, Validators.required],
      numberOfShiftsPerDay: [this.group?.config.numberOfShiftsPerDay ?? 1, Validators.required],
      numberOfOffDays: [this.group?.config.numberOfOffDays ?? 1, Validators.required],
      minTimeBetweenShifts: [this.group?.config.minTimeBetweenShifts ?? 1, Validators.required],
      participantsPerShift: this.fb.group({
        lower: [this.group?.config.minParticipantsPerShift ?? 1, Validators.required],
        upper: [this.group?.config.maxParticipantsPerShift ?? 10, Validators.required],
      }),
      supervisorsPerShift: this.fb.group({
        lower: [this.group?.config.minSupervisorsPerShift ?? 1, Validators.required],
        upper: [this.group?.config.maxSupervisorsPerShift ?? 10, Validators.required],
      }),
    });

  }

  onSubmit() {
    if (this.groupForm.valid) {
      const newGroup: Group = {
        _id: this.group?._id ?? 0,
        groupName: this.groupForm.value.groupName,
        participants: this.group?.participants ?? [],
        shifts: this.group?.shifts ?? [],
        schedule: this.group?.schedule ?? [],
        startDate: zonedTimeToUtc(this.groupForm.value.startDate, 'Europe/Berlin'),
        endDate: zonedTimeToUtc(this.groupForm.value.endDate, 'Europe/Berlin'),
        config: {
          isArchived: this.group?.config.isArchived ?? false,
          allowSwapping: this.groupForm.value.allowSwapping,
          numberOfShiftsPerDay: this.groupForm.value.numberOfShiftsPerDay,
          minTimeBetweenShifts: this.groupForm.value.minTimeBetweenShifts,
          numberOfOffDays: this.group?.config.numberOfOffDays ?? 1,
          minParticipantsPerShift: this.groupForm.value.participantsPerShift.lower,
          maxParticipantsPerShift: this.groupForm.value.participantsPerShift.upper,
          minSupervisorsPerShift: this.groupForm.value.supervisorsPerShift.lower,
          maxSupervisorsPerShift: this.groupForm.value.supervisorsPerShift.upper,
        },
      };

      if (!this.isEdit) {
        this.groupAdded.emit(newGroup);
      } else {
        this.groupEdited.emit(newGroup);
      }
      this.modalCtrl.dismiss(newGroup);
    }
  }
}
