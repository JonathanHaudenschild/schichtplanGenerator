import { Actions, concatLatestFrom, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import * as userActions from './users.actions';
import { Injectable } from '@angular/core';
import { UserState } from './users.model';
import { Store } from '@ngrx/store';
import { AuthManagementService } from 'src/app/services/auth-management.service';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
@Injectable()
export class UserEffects {
    constructor(
        private store: Store<UserState>,
        private actions$: Actions,
        private authService: AuthManagementService,
    ) { }

    signInAPIRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.signIn),
            exhaustMap(({ signInUser }) => {
                const { email, password } = signInUser;
                return this.authService.signIn(email, password).pipe(
                    map(({ data }) => {
                        if (data.token) {
                            this.authService.setToken(data.token);
                            return userActions.signInSuccess({
                                user: { profileUser: data.userProfile, token: data.token },
                                successAlert: { title: 'user.login.title', message: 'user.login.message', showAlert: false }
                            });
                        } else {
                            return userActions.signInFail({ errorAlert: { title: 'user.login.title', message: 'user.login.message', showAlert: true } })
                        }
                    }),
                    catchError(() => {
                        return of(userActions.signInFail({ errorAlert: { title: 'user.login.title', message: 'user.login.message', showAlert: true } }))
                    }))
            })
        )
    )

    signUpAPIRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.signUp),
            exhaustMap(({ signUpUser }) => {
                const { username, email, password, repeatPassword } = signUpUser;
                if (password !== repeatPassword) {
                    return of(userActions.signUpFail({ errorAlert: { title: 'user.passwordMismatch.title', message: 'user.passwordMismatch.message', showAlert: true } }));
                }
                return this.authService.signUp(username, email, password).pipe(
                    map(({ data }) => {
                        return userActions.signUpSuccess({
                            successAlert: { title: 'user.register.title', message: 'user.register.message', showAlert: true }
                        });
                    }),
                    catchError(async (error) => userActions.signUpFail({
                        errorAlert: {
                            title: 'user.register.error.title',
                            message: 'user.register.error..message',
                            showAlert: true
                        }
                    })));
            }))
    )
}