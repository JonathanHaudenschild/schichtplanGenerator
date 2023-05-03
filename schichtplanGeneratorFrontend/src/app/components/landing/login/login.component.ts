import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() loginSubmit = new EventEmitter<{ email: string; password: string }>();

  credentials = {
    email: '',
    password: '',
  };

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    if (this.credentials.email && this.credentials.password) {
      this.loginSubmit.emit(this.credentials);
    }
  }
}
