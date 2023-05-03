import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Group } from 'src/app/store/schedule/schedule.model';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss'],
})
export class GroupAddComponent implements OnInit {
  @Output() groupAdded = new EventEmitter<Group>();
  @Input() group: Group | null = null;
  groupForm: FormGroup;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }


  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.groupForm = this.fb.group({
      name: [this.group?.name ?? '', Validators.required],
      startDate: [new Date().toISOString(), Validators.required],
      endDate: [new Date().toISOString(), Validators.required],
      isEditable: [false, Validators.required],
      // Add other config properties form controls
      // Initialize other form controls for the remaining properties
    });
  }

  onSubmit() {
    if (this.groupForm.valid) {
      const newGroup: Group = this.groupForm.value;
      this.groupAdded.emit(newGroup);
      this.modalCtrl.dismiss(newGroup);
    }
  }
}
