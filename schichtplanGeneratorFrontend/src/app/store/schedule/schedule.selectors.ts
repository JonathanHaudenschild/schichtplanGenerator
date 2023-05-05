import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GroupsState, Participant, ParticipantsState, ScheduleState } from "./schedule.model";
import { groupsAdapter, participantsAdapter, shiftsAdapter } from "./schedule.reducer";

export const selectScheduleState = createFeatureSelector<
    Readonly<ScheduleState>
>('schedule');

export const selectParticipantsState = createSelector(
    selectScheduleState,
    (state: ScheduleState) => state.participants
);

export const selectGroupsState = createSelector(
    selectScheduleState,
    (state: ScheduleState) => state.groups
);

export const selectShiftsState = createSelector(
    selectScheduleState,
    (state: ScheduleState) => state.shifts
);

export const selectGeneratedShiftsState = createSelector(
    selectScheduleState,
    (state: ScheduleState) => state.generatedShifts
);

export const { selectAll: selectAllParticipants } = participantsAdapter.getSelectors(selectParticipantsState);

export const { selectEntities: selectAllParticipantsEntities } = participantsAdapter.getSelectors(selectParticipantsState);

export const { selectAll: selectAllGroups } = groupsAdapter.getSelectors(selectGroupsState);

export const { selectEntities: selectAllGroupsEntities } = groupsAdapter.getSelectors(selectGroupsState);

export const { selectAll: selectAllShifts } = shiftsAdapter.getSelectors(selectShiftsState)

export const selectSelectedGroupId = createSelector(
    selectGroupsState,
    (state: GroupsState) => state.selectedGroupId
);

export const selectSelectedGroup = createSelector(
    selectGroupsState,
    (state: GroupsState) => state.entities[state.selectedGroupId]
);
