import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState, UserStatus } from "./users.model";

export const selectUserState = createFeatureSelector<
    Readonly<UserState>
>('user');

export const selectUserStatus = createSelector(
    selectUserState,
    (state: UserState) => state?.status
);

export const selectAccessToken = createSelector(
    selectUserState,
    (state: UserState) => state?.user?.token
);

export const selectAuthentication = createSelector(
    selectUserStatus,
    (status: UserStatus) => status?.isAuthenticated
);

export const selectIsLoggedIn = createSelector(
    selectUserStatus,
    (status: UserStatus) => status?.isLoggedIn
);

export const selectIsLoading = createSelector(
    selectUserStatus,
    (status: UserStatus) => status?.isLoading
);

export const selectUserProfile = createSelector(
    selectUserState,
    (state: UserState) => state?.user?.profileUser
);
