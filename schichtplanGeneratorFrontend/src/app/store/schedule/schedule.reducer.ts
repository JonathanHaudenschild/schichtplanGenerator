import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { GeneratedShiftsState, Participant, ParticipantsState, Shift, ShiftsState, ScheduleState, Group, GroupsState } from "./schedule.model";
import * as schedule from './schedule.actions';

export const participantsAdapter: EntityAdapter<Participant> = createEntityAdapter<Participant>({
    selectId: (Participant: Participant) => Participant._id,
});

export const shiftsAdapter: EntityAdapter<Shift> = createEntityAdapter<Shift>({
    selectId: (shift: Shift) => shift._id,
});

export const generatedShiftsAdapter: EntityAdapter<Shift[]> = createEntityAdapter<Shift[]>({
});

export const groupsAdapter: EntityAdapter<Group> = createEntityAdapter<Group>({
    selectId: (group: Group) => group._id,
});

const initParticipant: Participant =
{
    _id: 0,
    name: '',
    participantToken: '',
    group: null,
    shifts: [],
    shiftsOpenForSwap: [],
    color: '',
    offDays: [],
    friends: [],
    enemies: [],
    shiftPreferences: {
        isNightShift: false,
        isLateShift: false,
        isEarlyShift: false,
    },
    experience: 0,
    arrivalTime: new Date(),
    departureTime: new Date(),
    absences: [],
    role: {
        isParticipant: true,
        isSupervisor: false,
    },
    logs: null,
    config: {
        canEdit: false,
        canSwap: false,
    },
}

const initShift: Shift = {
    _id: 0,
    name: '',
    order: 0,
    day: new Date(),
    group: null,
    participants: [],
    startDate: new Date(),
    endDate: new Date(),
    config: {
        isLocked: false,
        isNightShift: false,
        isLateShift: false,
        isEarlyShift: false,
        disableSwap: false,
        minParticipants: 0,
        maxParticipants: 8,
        minSupervisors: 1,
        maxSupervisors: 2,
    }
}

const initGroup: Group = {
    _id: 0,
    name: '',
    participants: [],
    shifts: [],
    schedule: [],
    startDate: new Date(),
    endDate: new Date(),
    config: {
        isEditable: false,
        isPublic: false,
        isPublished: false,
        isArchived: false,
        isGenerated: false,
        allowSwapping: false,
        numberOfShiftsPerDay: 0,
        minNumberOfShiftsBetween: 0,
        numberOfOffDays: 0,
        minParticipantsPerShift: 0,
        maxParticipantsPerShift: 0,
        minSupervisorsPerShift: 0,
        maxSupervisorsPerShift: 0,
    },
    editors: [],
}

const initParticipantsState: ParticipantsState = participantsAdapter.getInitialState(
    {
        selectedParticipantId: 0
    }
);

const initShiftsState: ShiftsState = shiftsAdapter.getInitialState(
    {
        selectedShiftId: 0,
    }
);

const initGroupsState: GroupsState = groupsAdapter.getInitialState(
    {
        selectedGroupId: 0,
    }
);

const initGeneratedShiftsState: GeneratedShiftsState = generatedShiftsAdapter.getInitialState(
    {
        selectedIndex: 0
    }
);

const initScheduleState: ScheduleState = {
    participants: initParticipantsState,
    shifts: initShiftsState,
    generatedShifts: initGeneratedShiftsState,
    groups: initGroupsState,
    status: {
        isLoading: false,
        loadingMessage: '',
    }
}

export const scheduleReducer = createReducer(
    initScheduleState,
    on(schedule.getParticipantsSuccess, (state: ScheduleState, { participants }) => {
        return { ...state, participants: participantsAdapter.setAll(participants, state.participants) };
    }),
    on(schedule.getParticipantByIdSuccess, (state: ScheduleState, { participant }) => {
        return { ...state, participants: participantsAdapter.upsertOne(participant, state.participants) };
    }),
    on(schedule.createParticipantSuccess, (state: ScheduleState, { participant }) => {
        return { ...state, participants: participantsAdapter.addOne(participant, state.participants) };
    }),
    on(schedule.updateParticipantSuccess, (state: ScheduleState, { participant }) => {
        return { ...state, participants: participantsAdapter.updateOne({ id: participant._id, changes: participant }, state.participants) };
    }),
    on(schedule.deleteParticipantSuccess, (state: ScheduleState, { participant }) => {
        return { ...state, participants: participantsAdapter.removeOne(participant._id, state.participants) };
    }),
    on(schedule.selectParticipant, schedule.getParticipantByIdSuccess, (state: ScheduleState, { participant }) => {
        return { ...state, participants: { ...state.participants, selectedParticipantId: participant._id } };
    }),
    on(schedule.createShiftSuccess, (state: ScheduleState, { shift }) => {
        return { ...state, shifts: shiftsAdapter.addOne(shift, state.shifts) };
    }),
    on(schedule.updateShiftSuccess, (state: ScheduleState, { shift }) => {
        return { ...state, shifts: shiftsAdapter.updateOne({ id: shift._id, changes: shift }, state.shifts) };
    }),
    on(schedule.deleteShiftSuccess, (state: ScheduleState, { shift }) => {
        return { ...state, shifts: shiftsAdapter.removeOne(shift._id, state.shifts) };
    }),
    on(schedule.getShiftsSuccess, (state: ScheduleState, { shifts }) => {
        return { ...state, shifts: shiftsAdapter.setAll(shifts, state.shifts) };
    }),
    on(schedule.getShiftByIdSuccess, (state: ScheduleState, { shift }) => {
        return { ...state, shifts: shiftsAdapter.upsertOne(shift, state.shifts) };
    }),
    on(schedule.getGeneratedShiftsSuccess, (state: ScheduleState, { generatedShifts }) => {
        return { ...state, generatedShifts: generatedShiftsAdapter.setAll(generatedShifts, state.generatedShifts) };
    }),
    on(schedule.getGroupsSuccess, (state: ScheduleState, { groups }) => {
        console.log(state, groups)
        return { ...state, groups: groupsAdapter.setAll(groups, state.groups) };
    }),
    on(schedule.getGroupByIdSuccess, (state: ScheduleState, { group }) => {
        return { ...state, groups: groupsAdapter.upsertOne(group, state.groups) };
    }),
    on(schedule.selectGroup, schedule.getGroupByIdSuccess, (state: ScheduleState, { group }) => {
        return { ...state, groups: { ...state.groups, selectedGroupId: group._id } };
    }),
    on(schedule.createGroupSuccess, (state: ScheduleState, { group }) => {
        return { ...state, groups: groupsAdapter.addOne(group, state.groups) };
    }),
    on(schedule.updateGroupSuccess, (state: ScheduleState, { group }) => {
        return { ...state, groups: groupsAdapter.updateOne({ id: group._id, changes: group }, state.groups) };
    }),
    on(schedule.deleteGroupSuccess, (state: ScheduleState, { group }) => {
        return { ...state, groups: groupsAdapter.removeOne(group._id, state.groups) };
    }),

);

