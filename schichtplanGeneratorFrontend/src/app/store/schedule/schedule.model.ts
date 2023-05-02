import { EntityState } from "@ngrx/entity/src";
import { User } from "../users/users.model";

export interface ScheduleState {
    status: ScheduleStatus,
}
export interface ScheduleStatus {
    isLoading: boolean;
    loadingMessage?: string;
}

export interface Shift {
    _id: number,
    name: string,
    order: number,
    day: Date,
    group: Group | null,
    participants: Participant[],
    startDate: Date,
    endDate: Date,
    config: {
        isLocked: boolean,
        isNightShift: boolean,
        isLateShift: boolean,
        isEarlyShift: boolean,
        minParticipants: number,
        maxParticipants: number,
        minSupervisors: number,
        maxSupervisors: number,
    },
}

export interface Group {
    _id: number,
    name: string,
    participants: Participant[],
    shifts: Shift[],
    schedule: Shift[],
    startDate: Date,
    endDate: Date,
    config: {
        isEditable: boolean,
        isPublic: boolean,
        isPublished: boolean,
        isArchived: boolean,
        isGenerated: boolean,
        numberOfShiftsPerDay: number,
        minNumberOfShiftsBetween: number,
        numberOfOffDays: number,
        minParticipantsPerShift: number,
        maxParticipantsPerShift: number,
        minSupervisorsPerShift: number,
        maxSupervisorsPerShift: number,
    },
    editors: User[],
}

export interface Participant {
    _id: number,
    participantToken: string,
    name: string,
    group: Group | null,
    shifts: Shift[],
    color: string,
    offDays: Date[],
    friends: Participant[],
    enemies: Participant[],
    shiftPreferences: {
        isNightShift: boolean,
        isLateShift: boolean,
        isEarlyShift: boolean,
    },
    experience: number,
    arrivalTime: Date,
    departureTime: Date,
    absences: { startDate: Date, endDate: Date }[],
    role: {
        isParticipant: boolean,
        isSupervisor: boolean,
    },
    logs: any,
    config: any
}

export interface ParticipantsState extends EntityState<Participant> {
    selectedParticipantId: number | null;
}
export interface ShiftsState extends EntityState<Shift> {
    selectedShiftId: number | null;
}
export interface GeneratedShiftsState extends EntityState<Shift> {
    selectedShiftId: number | null;
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
