import { EntityState } from "@ngrx/entity/src";
import { User } from "../users/users.model";

export interface ScheduleState {
    status: ScheduleStatus,
    groups: GroupsState,
    shifts: ShiftsState,
    participants: ParticipantsState,
    generatedShifts: GeneratedShiftsState,
}
export interface ScheduleStatus {
    isLoading: boolean;
    loadingMessage?: string;
}

export interface Shift {
    _id: number,
    shiftName: string,
    group: Group | null,
    participants: Participant[],
    startDate: Date,
    endDate: Date,
    category: number,
    type: number,
    experienceLevel: number,
    config: {
        isLocked: boolean,
        disableSwap: boolean,
        minParticipants: number,
        maxParticipants: number,
        minSupervisors: number,
        maxSupervisors: number,
    },
}

export interface Group {
    _id: number,
    groupName: string,
    participants: Participant[],
    shifts: Shift[],
    schedule: Shift[],
    startDate: Date,
    endDate: Date,
    config: {
        isArchived: boolean,
        allowSwapping: boolean,
        numberOfShiftsPerDay: number,
        minTimeBetweenShifts: number,
        numberOfOffDays: number,
        minParticipantsPerShift: number,
        maxParticipantsPerShift: number,
        minSupervisorsPerShift: number,
        maxSupervisorsPerShift: number,
    },
}

export interface Participant {
    _id: number,
    participantToken: string,
    displayName: string,
    group: Group | null,
    color: string,
    offDays: Date[],
    friends: string[],
    enemies: string[],
    shiftPreferences: Number
    experience: number,
    arrivalTime: Date,
    departureTime: Date,
    absences: { startDate: Date, endDate: Date }[],
    shifts: Shift[],
    shiftsOpenForSwap: Shift[],
    role: Number,
    logs: any,
    config: {
        canEdit: boolean,
        canSwap: boolean,
    }
}

export interface ParticipantsState extends EntityState<Participant> {
    selectedParticipantId: number | null;
}
export interface ShiftsState extends EntityState<Shift> {
    selectedShiftId: number | null;
}
export interface GeneratedShiftsState extends EntityState<Shift[]> {
    selectedIndex: number | null;
}

export interface GroupsState extends EntityState<Group> {
    selectedGroupId: number;
}
export interface ErrorAlert {
    title?: string,
    message?: string,
    error?: any,
    showAlert?: boolean
}


export interface SuccessAlert {
    title?: string,
    message?: string,
    showAlert?: boolean
}
