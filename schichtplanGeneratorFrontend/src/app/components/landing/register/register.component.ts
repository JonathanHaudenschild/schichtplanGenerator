import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() registerSubmit = new EventEmitter<{ userName: string; email: string; password: string; repeatPassword: string }>();

  registrationData = {
    userName: '',
    email: '',
    password: '',
    repeatPassword: '',
  };

  constructor() { }

  ngOnInit() { }

  onSubmit() {
    if (this.registrationData.userName && this.registrationData.email && this.registrationData.password && this.registrationData.repeatPassword) {
      this.registerSubmit.emit(this.registrationData);
    }
  }
}
