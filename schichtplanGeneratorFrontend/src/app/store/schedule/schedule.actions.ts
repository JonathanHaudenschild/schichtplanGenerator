import { createAction, props } from "@ngrx/store";
import { ErrorAlert, Group, Participant, Shift } from "./schedule.model";

export const getParticipants = createAction(
    '[Schedule/Participants] Get Participants',
);

export const getParticipantsSuccess = createAction(
    '[Schedule/Participants]  Get Participants Success',
    props<{ participants: Participant[] }>(),
);

export const getParticipantsFailure = createAction(
    '[Schedule/Participants]  Get Participants Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const getParticipantById = createAction(
    '[Schedule/Participants]  Get Participant By Id',
    props<{ participantId: number }>(),
);

export const getParticipantByIdSuccess = createAction(
    '[Schedule/Participants]  Get Participant By Id Success',
    props<{ participant: Participant }>(),
);

export const getParticipantByIdFailure = createAction(
    '[Schedule/Participants]  Get Participant By Id Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const selectParticipant = createAction(
    '[Schedule/Participants]  Select Participant',
    props<{ participant: Participant }>(),
);

export const createParticipant = createAction(
    '[Schedule/Participants]  Create Participant',
    props<{ participant: Participant }>(),
);

export const createParticipantSuccess = createAction(
    '[Schedule/Participants]  Create Participant Success',
    props<{ participant: Participant }>(),
);

export const createParticipantFailure = createAction(
    '[Schedule/Participants]  Create Participant Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const updateParticipant = createAction(
    '[Schedule/Participants]  Update Participant',
    props<{ participant: Participant }>(),
);

export const updateParticipantSuccess = createAction(
    '[Schedule/Participants]  Update Participant Success',
    props<{ participant: Participant }>(),
);

export const updateParticipantFailure = createAction(
    '[Schedule/Participants]  Update Participant Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const deleteParticipant = createAction(
    '[Schedule/Participants]  Delete Participant',
    props<{ participant: Participant }>(),
);

export const deleteParticipantSuccess = createAction(
    '[Schedule/Participants]  Delete Participant Success',
    props<{ participant: Participant }>(),
);

export const deleteParticipantFailure = createAction(
    '[Schedule/Participants]  Delete Participant Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const getShifts = createAction(
    '[Schedule/Shifts]  Get Shifts',
);

export const getShiftsSuccess = createAction(
    '[Schedule/Shifts]  Get Shifts Success',
    props<{ shifts: Shift[] }>(),
);

export const getShiftsFailure = createAction(
    '[Schedule/Shifts]  Get Shifts Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const getShiftById = createAction(
    '[Schedule/Shifts]  Get Shift By Id',
    props<{ shiftId: number }>(),
);

export const getShiftByIdSuccess = createAction(
    '[Schedule/Shifts]  Get Shift By Id Success',
    props<{ shift: Shift }>(),
);

export const getShiftByIdFailure = createAction(
    '[Schedule/Shifts]  Get Shift By Id Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const selectShift = createAction(
    '[Schedule/Shifts]  Select Shift',
    props<{ shift: Shift }>(),
);


export const createShift = createAction(
    '[Schedule/Shifts]  Create Shift',
    props<{ shift: Shift }>(),
);

export const createShiftSuccess = createAction(
    '[Schedule/Shifts]  Create Shift Success',
    props<{ shift: Shift }>(),
);

export const createShiftFailure = createAction(
    '[Schedule/Shifts]  Create Shift Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const updateShift = createAction(
    '[Schedule/Shifts]  Update Shift',
    props<{ shift: Shift }>(),
);

export const updateShiftSuccess = createAction(
    '[Schedule/Shifts]  Update Shift Success',
    props<{ shift: Shift }>(),
);

export const updateShiftFailure = createAction(
    '[Schedule/Shifts]  Update Shift Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const deleteShift = createAction(
    '[Schedule/Shifts]  Delete Shift',
    props<{ shift: Shift }>(),
);

export const deleteShiftSuccess = createAction(
    '[Schedule/Shifts]  Delete Shift Success',
    props<{ shift: Shift }>(),
);

export const deleteShiftFailure = createAction(
    '[Schedule/Shifts]  Delete Shift Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const generateShifts = createAction(
    '[Schedule/Shifts]  Generate Shifts',
);

export const generateShiftsSuccess = createAction(
    '[Schedule/Shifts]  Generate Shifts Success',
    props<{ shifts: Shift[] }>(),
);

export const generateShiftsFailure = createAction(
    '[Schedule/Shifts]  Generate Shifts Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const getGeneratedShifts = createAction(
    '[Schedule/Shifts]  Get Generated Shifts',
);

export const getGeneratedShiftsSuccess = createAction(
    '[Schedule/Shifts]  Get Generated Shifts Success',
    props<{ generatedShifts: [Shift[]] }>(),
);

export const getGeneratedShiftsFailure = createAction(
    '[Schedule/Shifts]  Get Generated Shifts Failure',
    props<{ errorAlert: ErrorAlert }>(),
);


export const getGroups = createAction(
    '[Schedule/Groups]  Get Groups',
);

export const getGroupsSuccess = createAction(
    '[Schedule/Groups]  Get Groups Success',
    props<{ groups: Group[] }>(),
);

export const getGroupsFailure = createAction(
    '[Schedule/Groups]  Get Groups Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const getGroupById = createAction(
    '[Schedule/Groups]  Get Group By Id',
    props<{ groupId: number }>(),
);

export const getGroupByIdSuccess = createAction(
    '[Schedule/Groups]  Get Group By Id Success',
    props<{ group: Group }>(),
);

export const getGroupByIdFailure = createAction(
    '[Schedule/Groups]  Get Group By Id Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const selectGroup = createAction(
    '[Schedule/Groups]  Select Group',
    props<{ group: Group }>(),
);

export const createGroup = createAction(
    '[Schedule/Groups]  Create Group',
    props<{ group: Group }>(),
);

export const createGroupSuccess = createAction(
    '[Schedule/Groups]  Create Group Success',
    props<{ group: Group }>(),
);

export const createGroupFailure = createAction(
    '[Schedule/Groups]  Create Group Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const updateGroup = createAction(
    '[Schedule/Groups]  Update Group',
    props<{ group: Group }>(),
);

export const updateGroupSuccess = createAction(
    '[Schedule/Groups]  Update Group Success',

    props<{ group: Group }>(),
);

export const updateGroupFailure = createAction(
    '[Schedule/Groups]  Update Group Failure',
    props<{ errorAlert: ErrorAlert }>(),
);

export const deleteGroup = createAction(
    '[Schedule/Groups]  Delete Group',
    props<{ group: Group }>(),
);

export const deleteGroupSuccess = createAction(
    '[Schedule/Groups]  Delete Group Success',
    props<{ group: Group }>(),
);

export const deleteGroupFailure = createAction(
    '[Schedule/Groups]  Delete Group Failure',
    props<{ errorAlert: ErrorAlert }>(),
);


export const openGroupsView = createAction(
    '[Schedule/Groups]  Open Groups View',
);