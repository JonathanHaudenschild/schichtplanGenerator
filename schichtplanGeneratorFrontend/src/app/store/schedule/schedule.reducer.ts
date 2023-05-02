import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { GeneratedShiftsState, Participant, ParticipantsState, ScheduleState as GeneratedShiftsState, Shift, ShiftsState, ScheduleState } from "./schedule.model";

export const participantsAdapter: EntityAdapter<Participant> = createEntityAdapter<Participant>({
    selectId: (Participant: Participant) => Participant._id,
});


export const shiftsAdapter: EntityAdapter<Shift> = createEntityAdapter<Shift>({
    selectId: (shift: Shift) => shift._id,
});

export const generatedShiftsAdapter: EntityAdapter<Shift> = createEntityAdapter<Shift>({
    selectId: (shift: Shift) => shift._id,
});

const initParticipant: Participant =
{
    _id: 0,
    name: '',
    participantToken: '',
    group: null,
    shifts: [],
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
    config: null,
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
        minParticipants: 0,
        maxParticipants: 8,
        minSupervisors: 1,
        maxSupervisors: 2,
    }
}

const initGroup = {
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
    { selectedParticipantId: 0 }
);

const initShiftsState: ShiftsState = shiftsAdapter.getInitialState(
    {
        selectedShiftId: 0,
    }
);

const initGeneratedShiftsState: GeneratedShiftsState = shiftsAdapter.getInitialState(
    {
        selectedShiftId: 0
    }
);

const initSchedulePage: ScheduleState= {
    status: {
        isLoading: false,
        loadingMessage: '',
    }
}