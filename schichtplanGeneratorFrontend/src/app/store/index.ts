import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { filter, map, Observable } from "rxjs";
import { concatLatestFrom } from "@ngrx/effects";
import { UserState } from "./users/users.model";
import { userReducer } from "./users/users.reducer";
import { UserEffects } from "./users/users.effects";
import { ScheduleState } from "./schedule/schedule.model";
import { ScheduleEffects } from "./schedule/schedule.effects";
import { scheduleReducer } from "./schedule/schedule.reducer";
import { StorageService } from "../services/storage.service";
import { RouterReducerState, routerReducer } from "@ngrx/router-store";

export const CONFIG_KEY = '__config';
export const USER_KEY = '__user';
export interface AppState {
    user: UserState,
    router: RouterReducerState,
    schedule: ScheduleState
}

export const effects: any[] = [UserEffects, ScheduleEffects]

export const reducers: ActionReducerMap<AppState> = {
    user: userReducer,
    schedule: scheduleReducer,
    router: routerReducer,
}

export const metaReducers: MetaReducer[] = [

]


/**
 * This Meta Reducer stores the current states into the ionic local storage whenever it's action has been made
 * @param storage Injecting Storage service into reducer
 * @returns 
 */
export function getMetaReducers(storage: StorageService): MetaReducer<AppState> {
    function storing(reducer: ActionReducer<AppState>): ActionReducer<AppState> {

        return (state, action) => {

            const nextState = reducer(state, action);
             console.log(state, action, nextState)
            if (nextState?.user && action.type.includes("[User]")) {
                console.log('nextState', state?.user, nextState.user)
                storage.set(USER_KEY, nextState?.user);
            }
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