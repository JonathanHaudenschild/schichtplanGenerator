import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Participant } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-participant-add',
  templateUrl: './participants-add.component.html',
  styleUrls: ['./participants-add.component.scss'],
})
export class ParticipantsAddComponent implements OnInit {
  @Input() participantToEdit: Participant | null = null;
  @Output() participantAdded = new EventEmitter<Participant>();
  @Output() participantUpdated = new EventEmitter<Participant>();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }


  participantForm: FormGroup;

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.participantForm = this.fb.group({
      participantToken: ['', Validators.required],
      name: [''],
      color: [''],
      offDays: [new Date().toISOString()],
      friends: [[]],
      enemies: [[]],
      isNightShift: [false],
      isLateShift: [false],
      isEarlyShift: [false],
      experience: [0, Validators.min(0)],
      arrivalTime: [new Date().toISOString()],
      departureTime: [new Date().toISOString()],
      absences: this.fb.array([]),
      isSupervisor: [false],
    });

    // If editing, populate the form with the participant data
    if (this.participantToEdit) {
      this.participantForm.patchValue(this.participantToEdit);
    }
  }

  get absences(): FormArray {
    return this.participantForm.get('absences') as FormArray;
  }

  addAbsence(): void {
    this.absences.push(
      this.fb.group({
        startDate: [new Date().toISOString(), Validators.required],
        endDate: [new Date().toISOString(), Validators.required],
      }),
    );
  }

  onSubmit() {
    if (this.participantForm.valid) {
      const participantData: Participant = this.participantForm.value;
      if (this.participantToEdit) {
        // Update the participant with the new data
        const updatedParticipant: Participant = {
          ...this.participantToEdit,
          ...participantData,
        };
        this.participantUpdated.emit(updatedParticipant);
      } else {
        // Create a new participant
        const newParticipant: Participant = participantData;
        this.participantAdded.emit(newParticipant);
      }
      this.modalCtrl.dismiss();
    }
  }
}