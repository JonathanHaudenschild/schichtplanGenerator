import { createAction, props } from "@ngrx/store";
import { ErrorAlert, SignInUser, SignUpUser, SuccessAlert, User, UserState } from "./users.model";

export const initUser = createAction(
    '[User] Init User',
);

export const initUserSuccess = createAction(
    '[User] Init User Success',
    props<{ initState: UserState, successAlert?: SuccessAlert }>()
);

export const initUserFail = createAction(
    '[User] Init User Fail',
    props<{ errorAlert: ErrorAlert }>()
);
export const signIn = createAction(
    '[User] Sign In',
    props<{ signInUser: SignInUser }>()
);

export const signInSuccess = createAction(
    '[User] Sign In Success',
    props<{ user: User, successAlert?: SuccessAlert }>()
);

export const signInFail = createAction(
    '[User] Sign In Fail',
    props<{ errorAlert: ErrorAlert }>()
);

export const signUp = createAction(
    '[User] Sign Up',
    props<{ signUpUser: SignUpUser }>()
);

export const signUpSuccess = createAction(
    '[User] Sign Up Success',
    props<{ successAlert?: SuccessAlert }>()
);

export const signUpFail = createAction(
    '[User] Sign Up Fail',
    props<{ errorAlert: ErrorAlert }>()
);  