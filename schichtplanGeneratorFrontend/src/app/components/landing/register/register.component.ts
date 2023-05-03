import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() registerSubmit = new EventEmitter<{ name: string; email: string; password: string; repeatpassword: string }>();

  registrationData = {
    name: '',
    email: '',
    password: '',
    repeatpassword: '',
  };

  constructor() { }

  ngOnInit() { }

  onSubmit() {
    if (this.registrationData.name && this.registrationData.email && this.registrationData.password && this.registrationData.repeatpassword) {
      this.registerSubmit.emit(this.registrationData);
    }
  }
}
