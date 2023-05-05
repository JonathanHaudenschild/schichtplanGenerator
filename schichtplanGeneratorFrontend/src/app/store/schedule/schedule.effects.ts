import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { ErrorAlert, Participant, ScheduleState, Shift } from './schedule.model';
import * as ScheduleActions from './schedule.actions';
import { ParticipantApiService } from 'src/app/services/participant-api.service';

import { Store } from '@ngrx/store';
import { selectSelectedGroup, selectSelectedGroupId } from './schedule.selectors';
import { Router } from '@angular/router';
import { GroupApiService } from 'src/app/services/group-api.service';
import { ShiftApiService } from 'src/app/services/shift-api.service';
import { th } from 'date-fns/locale';
@Injectable()
export class ScheduleEffects {
    constructor(private actions$: Actions,
        private participantsService: ParticipantApiService,
        private groupsService: GroupApiService,
        private shiftsService: ShiftApiService,
        private store: Store<ScheduleState>,
        private router: Router
    ) { }

    /*
    * Groups
    */

    getGroups$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.getGroups),
            exhaustMap(() =>
                this.groupsService.getGroups().pipe(
                    map((response) => {
                        const groups = response.data;
                        return ScheduleActions.getGroupsSuccess({ groups });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.getGroupsFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    getGroupById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.getGroupById),
            exhaustMap(({ groupId }) =>
                this.groupsService.getGroupById(groupId).pipe(
                    map((response) => {
                        const group = response.data;
                        return ScheduleActions.getGroupByIdSuccess({ group });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.getGroupByIdFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    createGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.createGroup),
            exhaustMap(({ group }) =>
                this.groupsService.createGroup(group).pipe(
                    map((response) => {
                        const group = response.data;
                        return ScheduleActions.createGroupSuccess({ group });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.createGroupFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    updateGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.updateGroup),
            exhaustMap(({ group }) =>
                this.groupsService.updateGroup(group._id, group).pipe(
                    map((response) => {
                        const group = response.data;
                        return ScheduleActions.updateGroupSuccess({ group });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.updateGroupFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    deleteGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.deleteGroup),
            exhaustMap(({ group }) =>
                this.groupsService.deleteGroup(group._id).pipe(
                    map((response) => {
                        const group = response.data;
                        return ScheduleActions.deleteGroupSuccess({ group });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.deleteGroupFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );








    handleRoutingToGroupOverview$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.selectGroup),
            tap(({ group }) => {
                this.router.navigate(['/groups/' + group._id]);
            }),
            catchError((error) => { return of(error) })),
        { dispatch: false }
    )




    handleRoutingToGroupsView$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.openGroupsView),
            tap(() => {
                this.router.navigate(['/groups']);
            }),
            catchError((error) => { return of(error) })),
        { dispatch: false }
    )



    /*
    * Participants
    */

    getParticipants$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.getParticipants, ScheduleActions.getGroupByIdSuccess),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([, groupId]) =>
                this.participantsService.getParticipants(groupId).pipe(
                    map((response) => {
                        const participants: Participant[] = response.data;
                        return ScheduleActions.getParticipantsSuccess({ participants });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.getParticipantsFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    getParticipantById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.getParticipantById),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ participantId }, groupId]) =>
                this.participantsService.getParticipantById(groupId, participantId).pipe(
                    map((response) => {
                        const participant: Participant = response.data;
                        return ScheduleActions.getParticipantByIdSuccess({ participant });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.getParticipantByIdFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    createParticipant$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.createParticipant),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ participant }, groupId]) => {
                console.log(participant)
                return this.participantsService.createParticipant(groupId, participant).pipe(
                    map((response) => {
                        const participant: Participant = response.data;
                        return ScheduleActions.createParticipantSuccess({ participant });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.createParticipantFailure({ errorAlert: error }))
                    )
                )
            }
            )
        )
    );

    updateParticipant$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.updateParticipant),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ participant }, groupId]) =>
                this.participantsService.updateParticipant(groupId, participant._id, participant).pipe(
                    map((response) => {
                        const participant: Participant = response.data;
                        return ScheduleActions.updateParticipantSuccess({ participant });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.updateParticipantFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    deleteParticipant$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.deleteParticipant),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ participant }, groupId]) =>
                this.participantsService.deleteParticipant(groupId, participant._id).pipe(
                    map(() => ScheduleActions.deleteParticipantSuccess({ participant })),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.deleteParticipantFailure({ errorAlert: error }))
                    )
                )
            )
        )
    );

    getShifts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.getShifts, ScheduleActions.getGroupByIdSuccess),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([, groupId]) =>
                this.shiftsService.getShifts(groupId).pipe(
                    map((response) => {
                        const shifts: Shift[] = response.data;
                        return ScheduleActions.getShiftsSuccess({ shifts });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.getShiftsFailure({ errorAlert: error }))
                    )
                )
            )
        ));

    getShiftById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.getShiftById),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ shiftId }, groupId]) =>
                this.shiftsService.getShiftById(groupId, shiftId).pipe(
                    map((response) => {
                        const shift: Shift = response.data;
                        return ScheduleActions.getShiftByIdSuccess({ shift });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.getShiftByIdFailure({ errorAlert: error }))
                    )
                )
            )
        ));

    createShift$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.createShift),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ shift }, groupId]) =>
                this.shiftsService.createShift(groupId, shift).pipe(
                    map((response) => {
                        const shift: Shift = response.data;
                        return ScheduleActions.createShiftSuccess({ shift });
                    }),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.createShiftFailure({ errorAlert: error }))
                    )
                )
            )
        ));

    updateShift$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.updateShift),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ shift }, groupId]) =>
                this.shiftsService.updateShift(groupId, shift._id, shift).pipe(
                    map((response) => {
                        const shift: Shift = response.data;
                        return ScheduleActions.updateShiftSuccess({ shift });
                    }
                    ),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.updateShiftFailure({ errorAlert: error }))
                    )
                )
            )
        ));

    deleteShift$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.deleteShift),
            concatLatestFrom(() => this.store.select(selectSelectedGroupId)),
            exhaustMap(([{ shift }, groupId]) =>
                this.shiftsService.deleteShift(groupId, shift._id).pipe(
                    map(() => ScheduleActions.deleteShiftSuccess({ shift })),
                    catchError((error: ErrorAlert) =>
                        of(ScheduleActions.deleteShiftFailure({ errorAlert: error }))
                    )
                )
            )
        ));



}
