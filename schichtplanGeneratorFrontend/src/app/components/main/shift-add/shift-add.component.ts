import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { roundToNearestMinutes } from 'date-fns';
import { Shift } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-shift-add',
  templateUrl: './shift-add.component.html',
  styleUrls: ['./shift-add.component.scss'],
})
export class ShiftAddComponent implements OnInit {
  @Output() shiftAdded = new EventEmitter<Shift>();
  @Output() shiftEdited = new EventEmitter<Shift>();
  @Input() shift: Shift | null = null;
  @Input() isEdit: boolean = false;
  shiftForm: FormGroup;

  getLocalISOString(date: Date) {
    const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localISOTime = new Date(date.getTime() - tzOffset);
    return localISOTime;
  }

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    const startDate = roundToNearestMinutes(this.getLocalISOString(new Date()), { nearestTo: 30, roundingMethod: 'ceil' }).toISOString();
    const endDate = roundToNearestMinutes(this.getLocalISOString(new Date()), { nearestTo: 30, roundingMethod: 'ceil' }).toISOString();


    this.shiftForm = this.fb.group({
      shiftName: ['', Validators.required],
      participants: [[]],
      startDate: [startDate, Validators.required],
      endDate: [endDate, Validators.required],
      category: [0, Validators.required],
      type: [0, Validators.required],
      experienceLevel: [0, Validators.required],
      config: this.fb.group({
        isLocked: [false],
        disableSwap: [false],
        minParticipants: [2, Validators.required],
        maxParticipants: [8, Validators.required],
        minSupervisors: [2, Validators.required],
        maxSupervisors: [2, Validators.required],
      }),
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.shiftForm.valid) {
      const newShift: Shift = {
        _id: this.shift?._id || 0,
        shiftName: this.shiftForm.value.shiftName,
        group: this.shift?.group || null,
        participants: this.shiftForm.value.participants,
        startDate: new Date(this.shiftForm.value.startDate),
        endDate: new Date(this.shiftForm.value.endDate),
        category: this.shiftForm.value.category,
        type: this.shiftForm.value.type,
        experienceLevel: this.shiftForm.value.experienceLevel,
        config: {
          isLocked: this.shiftForm.value.config.isLocked,
          disableSwap: this.shiftForm.value.config.disableSwap,
          minParticipants: this.shiftForm.value.config.minParticipants,
          maxParticipants: this.shiftForm.value.config.maxParticipants,
          minSupervisors: this.shiftForm.value.config.minSupervisors,
          maxSupervisors: this.shiftForm.value.config.maxSupervisors,
        },
      };

      // Process the newShift object as needed (e.g., save it to a database, display it in the UI)
      if (!this.isEdit) {
        this.shiftAdded.emit(newShift);
      } else {
        this.shiftEdited.emit(newShift);
      }
      this.modalCtrl.dismiss(newShift);
    }
  }
}