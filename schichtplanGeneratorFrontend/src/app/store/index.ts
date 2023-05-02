import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { filter, map, Observable } from "rxjs";
import { concatLatestFrom } from "@ngrx/effects";
import { UserState } from "./users/users.model";
import { userReducer } from "./users/users.reducer";

export const COURSES_KEY = '__courses';
export const CONFIG_KEY = '__config';
export const USER_KEY = '__user';
export const DASHBOARD_KEY = '__dashboard';
export interface AppState {
    user: UserState,
}

export const effects: any[] = []

export const reducers: ActionReducerMap<AppState> = {
    user: userReducer,
}

export const metaReducers: MetaReducer[] = [

]


/**
 * This Meta Reducer stores the current states into the ionic local storage whenever it's action has been made
 * @param storage Injecting Storage service into reducer
 * @returns 
 */
export function getMetaReducers(): MetaReducer<AppState> {
    function storing(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
        return (state, action) => {
            const nextState = reducer(state, action);
            // if (nextState?.user && action.type.includes("[User]")) {
            //     storage.set(USER_KEY, nextState?.user);
            // }
            return nextState;
        };
    }
    return storing;
}


/**
 * Helper functions
 */

export function allowWhen(decider$: Observable<boolean>) {
    return function <T>(source$: Observable<T>): Observable<T> {
        return source$.pipe(
            concatLatestFrom(() => decider$),
            filter(([, decider]) => decider),
            map(([value]) => value),
        )
    }
}   