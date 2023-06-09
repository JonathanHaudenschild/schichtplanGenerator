import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { roundToNearestMinutes } from 'date-fns';
import { Participant } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-participants-add',
  templateUrl: './participants-add.component.html',
  styleUrls: ['./participants-add.component.scss'],
})
export class ParticipantsAddComponent implements OnChanges {
  @Output() participantAdded = new EventEmitter<Participant>();
  @Output() participantEdited = new EventEmitter<Participant>();
  @Input() participant: Participant | null = null;
  @Input() isEdit: boolean = false;
  participantForm: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes) {
      return;
    }
    if (changes['participant'].currentValue) {

      this.participantForm.patchValue({
        participantToken: changes['participant'].currentValue.participantToken,
        displayName: changes['participant'].currentValue.displayName,
        color: changes['participant'].currentValue.color,
        offDays: changes['participant'].currentValue.offDays,
        friends: changes['participant'].currentValue.friends,
        enemies: changes['participant'].currentValue.enemies,
        shiftPreferences: changes['participant'].currentValue.shiftPreferences,
        experience: changes['participant'].currentValue.experience,
        arrivalTime: this.getLocalISOString(new Date(changes['participant'].currentValue.arrivalTime)).toISOString(),
        departureTime: this.getLocalISOString(new Date(changes['participant'].currentValue.departureTime)).toISOString(),
        absences: changes['participant'].currentValue.absences,
        role: changes['participant'].currentValue.role,
      })// Add code to handle changes to participant input if needed
    }
  }

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    const arrivalTime = roundToNearestMinutes(this.getLocalISOString(new Date()), { nearestTo: 30, roundingMethod: 'ceil' }).toISOString();
    const departureTime = roundToNearestMinutes(this.getLocalISOString(new Date()), { nearestTo: 30, roundingMethod: 'ceil' }).toISOString();

    this.participantForm = this.fb.group({
      participantToken: [this.participant?.participantToken ?? '', Validators.required],
      displayName: [this.participant?.displayName ?? '', Validators.required],
      color: [this.participant?.color ?? ''],
      offDays: [[]], // Add form controls for offDays dynamically
      friends: [[]], // Add form controls for friends dynamically
      enemies: [[]], // Add form controls for enemies dynamically
      shiftPreferences: [this.participant?.shiftPreferences ?? 0, Validators.required],
      experience: [this.participant?.experience ?? 0, Validators.required],
      arrivalTime: [arrivalTime, Validators.required],
      departureTime: [departureTime, Validators.required],
      absences: this.fb.array([]), // Add form groups for absences dynamically
      role: [this.participant?.role ?? 0, Validators.required],
    });
  }

  get offDays(): FormArray {
    return this.participantForm.get('offDays') as FormArray;
  }

  get absences(): FormArray {
    return this.participantForm.get('absences') as FormArray;
  }

  getLocalISOString(date: Date) {
    const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localISOTime = new Date(date.getTime() - tzOffset);
    return localISOTime;
  }


  onSubmit() {
    if (this.participantForm.valid) {
      const newParticipant: Participant = {
        _id: this.participant?._id ?? 0,
        participantToken: this.participantForm.value.participantToken,
        realName: this.participant?.realName ?? '',
        description: this.participant?.description ?? '',
        displayName: this.participantForm.value.displayName,
        group: this.participant?.group ?? null,
        color: this.participantForm.value.color,
        offDays: this.participantForm.value.offDays,
        friends: this.participantForm.value.friends,
        enemies: this.participantForm.value.enemies,
        shiftPreferences: this.participantForm.value.shiftPreferences,
        experience: this.participantForm.value.experience,
        arrivalTime: this.participantForm.value.arrivalTime,
        departureTime: this.participantForm.value.departureTime,
        absences: this.participantForm.value.absences,
        shifts: this.participant?.shifts ?? [],
        shiftsOpenForSwap: this.participant?.shiftsOpenForSwap ?? [],
        role: this.participantForm.value.role,
        logs: this.participant?.logs ?? null,
        config: this.participant?.config ?? {
          canEdit: false,
          canSwap: false,
        },
      };

      console.log(this.participantForm.value)

      if (!this.isEdit) {
        this.participantAdded.emit(newParticipant);
      } else {
        this.participantEdited.emit(newParticipant);
      }
      this.modalCtrl.dismiss(newParticipant);
    }
  }
}
