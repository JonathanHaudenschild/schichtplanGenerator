import { createReducer, on } from "@ngrx/store";
import * as user from './users.actions';
import { ProfileUser, UserState } from "./users.model";


export const initUserState: UserState = {
    user: {
        profileUser: {
            _id: 0,
            userName: '',
            email: '',
        },
        token: '',
    },
    status: {
        isLoading: false,
        loadingMessage: '',
        isAuthenticated: false,
        isLoggedIn: false,
    }
}


export const userReducer = createReducer(
    initUserState,
    on(user.initUserSuccess, (state, { initState }) => ({ ...state, ...initState, status: { ...initState.status, isLoading: false } })),
    on(user.signUpSuccess, (state) => ({ ...state, status: { ...state.status } })),
    on(user.signInSuccess, (state, { user }) => ({ ...state, user, status: { ...state.status, isLoading: false, isLoggedIn: true, isAuthenticated: true } })),
    on(user.signIn, (state) => ({ ...state, status: { ...state.status, isLoading: true } })),
);


