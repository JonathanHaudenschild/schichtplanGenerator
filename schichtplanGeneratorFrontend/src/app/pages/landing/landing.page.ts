import { Component, OnInit } from '@angular/core';
import { signIn, signUp } from 'src/app/store/users/users.actions';
import { SignInUser, SignUpUser } from 'src/app/store/users/users.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() { }

  handleLoginSubmit(credentials: { email: string; password: string }) {
    const signInUser: SignInUser = {
      email: credentials.email,
      password: credentials.password,
    };
    this.store.dispatch(signIn({ signInUser }));
  }
  handleRegisterSubmit(registrationData: { name: string; email: string; password: string }) {
    const signUpUser: SignUpUser = {
      username: registrationData.name,
      email: registrationData.email,
      password: registrationData.password,
      repeatPassword: registrationData.password,
    };
    this.store.dispatch(signUp({ signUpUser }));
  }
}
