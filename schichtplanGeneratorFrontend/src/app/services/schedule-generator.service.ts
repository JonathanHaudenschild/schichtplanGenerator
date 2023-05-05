import { Injectable } from '@angular/core';
import { Group, Participant, Shift } from '../store/schedule/schedule.model';
import { differenceInMilliseconds, eachDayOfInterval, isAfter, isBefore, isSameDay } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ScheduleGeneratorService {

  constructor() { }

  public async generateSchedule(group: Group, participants: Participant[], shifts: Shift[]): Promise<Shift[]> {
    // 2. Prepare data structures and helper functions for shift generation
    const initialSchedule = generateInitialSchedule(group, participants, shifts); // Implement this function to generate an initial schedule
    const initialTemperature = 200;
    const coolingRate = 0.99;
    const numIterations = 100;

    const bestSchedule = simulatedAnnealing(initialSchedule, initialTemperature, coolingRate, numIterations, group);
    return bestSchedule;

  }
}


// Helper functions
const checkArrivalDepartureAbsences = (participant: Participant, currentShift: Shift) => {
  const arrivalTime = new Date(participant.arrivalTime);
  const departureTime = new Date(participant.departureTime);
  const shiftStart = new Date(currentShift.startDate);
  const shiftEnd = new Date(currentShift.endDate);
  const absences = participant.absences;

  // Check if the participant's arrivalTime and departureTime allow them to be assigned on the given day
  if (isBefore(shiftEnd, arrivalTime) || isAfter(shiftStart, departureTime)) {
    return false;
  }

  // Check if the participant has an absence on the given day
  for (const absence of absences) {
    if (
      (isBefore(shiftStart, absence.startDate) && isAfter(shiftEnd, absence.startDate)) ||
      (isBefore(shiftStart, absence.endDate) && isAfter(shiftEnd, absence.endDate)) ||
      (isAfter(shiftStart, absence.startDate) && isBefore(shiftStart, absence.endDate)) ||
      (isAfter(shiftEnd, absence.startDate) && isBefore(shiftEnd, absence.endDate)) ||
      (isAfter(shiftStart, absence.startDate) && isBefore(shiftEnd, absence.endDate)) ||
      (isBefore(shiftStart, absence.startDate) && isAfter(shiftEnd, absence.endDate))
    ) {
      return false;
    }
  }
  return true;
}

const checkMinTimeBetweenShifts = (participant: Participant, currentShift: Shift, minBreakTimeBetween = 2) => {
  const currentShiftStart = new Date(currentShift.startDate);
  if (participant.shifts.length === 0) {
    return true;
  }

  const filteredShifts = participant.shifts.filter(shift => shift._id !== currentShift._id);

  return filteredShifts.every(shift => {
    const shiftEnd = new Date(shift.endDate);
    const timeBetweenShifts = differenceInMilliseconds(shiftEnd, currentShiftStart);
    return timeBetweenShifts > minBreakTimeBetween;
  });
};

const checkOffDays = (participant: Participant, currentShift: Shift, numberOfOffDays = 1) => {
  const offDays = participant.offDays.slice(0, numberOfOffDays);
  const shiftStart = new Date(currentShift.startDate);
  const shiftEnd = new Date(currentShift.endDate);
  // Check if the day is not within the participant's desired offDays
  for (const offDay of offDays) {
    const offDayDate = new Date(offDay);
    if (isSameDay(shiftStart, offDayDate) || isSameDay(shiftEnd, offDayDate)) {
      return false;
    }
  }

  // If the day is not found in the participant's offDays, return true
  return true;
};



/**
 * 
 * @param {*} participant 
 * @param {*} currentShift 
 * @returns 
 */
const checkEnemies = (participant: Participant, currentShift: Shift) => {
  const filteredParticipants = currentShift.participants.filter(p => p.participantToken?.toString() !== participant.participantToken.toString());


  return !(
    (filteredParticipants.some(p => participant.enemies.includes(p.participantToken?.toString()))) ||
    (filteredParticipants.some(p => participant.enemies.includes(p.displayName?.toString())) ||
      filteredParticipants.some(p => (participant.enemies.includes(p.realName?.toString()))))
  )
};

const checkFriends = (participant: Participant, currentShift: Shift,) => {
  const filteredParticipants = currentShift.participants.filter(p => p.participantToken?.toString() !== participant.participantToken.toString());
  return (filteredParticipants.some(p => participant.friends.includes(p.participantToken?.toString()))) ||
    (filteredParticipants.some(p => participant.friends.includes(p.displayName?.toString()))) ||
    (filteredParticipants.some(p => participant.friends.includes(p.realName?.toString())))

};

const checkExperienceMixing = (participant: Participant, currentShift: Shift) => {
  let experiencedCount = 0;

  const filteredParticipants = currentShift.participants.filter(p => p.participantToken?.toString() !== participant.participantToken.toString());


  for (const otherParticipant of filteredParticipants) {
    experiencedCount += otherParticipant.experience || 0;
  }

  if (participant.experience > 0 && experiencedCount < currentShift.config.minParticipants / 2) {
    {
      return true;
    }
  } else if (participant.experience === 0 && experiencedCount > currentShift.config.minParticipants / 2) {
    return true;
  }
  return false;
};

const checkExperienceLevel = (participant: Participant, currentShift: Shift) => {
  return currentShift.experienceLevel >= participant.experience;
};

const checkShiftPreferences = (participant: Participant, currentShift: Shift) => participant.shiftPreferences.includes(currentShift.type);

const checkCategoryMatchesRole = (participant: Participant, currentShift: Shift) => {
  return currentShift.category === participant.role
};


const checkParticipantsPerShift = (currentShift: Shift) => {
  const minParticipants = currentShift.config.minParticipants;
  const maxParticipants = currentShift.config.maxParticipants;
  const numberOfParticipants = currentShift.participants.length;

  return numberOfParticipants >= minParticipants && numberOfParticipants <= maxParticipants;
};


const calculateCost = (schedule: Shift[], group: Group) => {
  let cost = 0;
  schedule.forEach((currentShift) => {
    currentShift.participants.forEach((participant) => {
      if (!checkArrivalDepartureAbsences(participant, currentShift)) {
        cost += 5000; // High priority
      }

      if (!checkCategoryMatchesRole(participant, currentShift)) {
        cost += 2500;
      }

      if (!checkMinTimeBetweenShifts(participant, currentShift, group.config.minTimeBetweenShifts)) {
        cost += 2000;
      }


      if (!checkEnemies(participant, currentShift)) {
        cost += 1000;
      }

      if (!checkOffDays(participant, currentShift, group.config.numberOfOffDays)) {
        cost += 600;
      }


      if (!checkExperienceMixing(participant, currentShift)) {
        cost += 300;
      }


      if (!checkExperienceLevel(participant, currentShift)) {
        cost += 250;
      }

      if (!checkFriends(participant, currentShift)) {
        cost += 200;
      }
      if (!checkParticipantsPerShift(currentShift)) {
        cost += 100; // Lower priority
      }
      if (!checkShiftPreferences(participant, currentShift)) {
        cost += 50; // Lower priority
      }
    });
  });
  return cost;
};


const generateRandomNeighbor = (newSchedule: Shift[]) => {
  const numberOfShifts = newSchedule.length;

  // Choose two random shifts
  const shiftIndex1 = Math.floor(Math.random() * numberOfShifts);
  const shiftIndex2 = Math.floor(Math.random() * numberOfShifts);

  // Choose one random participant from each shift
  const participantIndex1 = Math.floor(Math.random() * newSchedule[shiftIndex1].participants.length);
  const participantIndex2 = Math.floor(Math.random() * newSchedule[shiftIndex2].participants.length);
  const newSchedule1 = moveOrSwapParticipants(newSchedule, shiftIndex1, participantIndex1, shiftIndex2, participantIndex2);
  return newSchedule1;
};

const moveOrSwapParticipants = (newSchedule: Shift[], shiftIndex1: number, participantIndex1: number, shiftIndex2: number, participantIndex2: number) => {
  const temp = newSchedule[shiftIndex1].participants[participantIndex1];

  if (
    newSchedule[shiftIndex2].participants.length < (newSchedule[shiftIndex2].config.maxParticipants - 1) &&
    newSchedule[shiftIndex1].participants.length > (newSchedule[shiftIndex1].config.minParticipants + 1)
  ) {
    // // Remove shift from participant
    // temp.shifts = temp.shifts.filter(shift => shift._id.toString() !== newSchedule[shiftIndex1]._id.toString());
    // // Add shift to participant
    // temp.shifts.push(newSchedule[shiftIndex2]);

    // Move the participant to the target shift
    newSchedule[shiftIndex2].participants.push(temp);
    newSchedule[shiftIndex1].participants.splice(participantIndex1, 1);
  } else {


    newSchedule[shiftIndex1].participants[participantIndex1] = newSchedule[shiftIndex2].participants[participantIndex2];
    newSchedule[shiftIndex2].participants[participantIndex2] = temp;
    // // Remove the shifts from each participant's array
    // newSchedule[shiftIndex1].participants[participantIndex1].shifts = tempShifts1.filter(shift => shift._id.toString() !== newSchedule[shiftIndex1]._id.toString());
    // newSchedule[shiftIndex2].participants[participantIndex2].shifts = tempShifts2.filter(shift => shift._id.toString() !== newSchedule[shiftIndex2]._id.toString());

    // // Add the swapped shifts to each participant's array
    // newSchedule[shiftIndex1].participants[participantIndex1].shifts.push(newSchedule[shiftIndex2]);
    // newSchedule[shiftIndex2].participants[participantIndex2].shifts.push(newSchedule[shiftIndex1]);
  }

  return newSchedule;
}


const simulatedAnnealing = (initialSchedule: Shift[], initialTemperature: number, coolingRate: number, numIterations: number, group: Group) => {
  let currentSchedule = initialSchedule;
  let currentCost = calculateCost(currentSchedule, group);
  let bestSchedule = currentSchedule;
  let bestCost = currentCost;
  let temperature = initialTemperature;

  for (let i = 0; i < numIterations; i++) {
    const newSchedule = generateRandomNeighbor(currentSchedule);

    const newCost = calculateCost(newSchedule, group);
    const costDifference = newCost - currentCost;

    if (costDifference <= 0 || Math.random() < Math.exp(-costDifference / temperature)) {
      currentSchedule = newSchedule;
      currentCost = newCost;

      if (currentCost < bestCost) {
        bestCost = currentCost;
        bestSchedule = currentSchedule;
      }
    }

    console.log(newSchedule);
    temperature *= coolingRate;
  }
  console.log(bestSchedule);
  return bestSchedule;
};

const generateInitialSchedule = (group: Group, participants: Participant[], shifts: Shift[]) => {
  let initialSchedule: Shift[] = [];

  // Initialize the schedule with empty shifts
  shifts.forEach(shift => {
    initialSchedule.push(shift);
  });


  const shiftsPerParticipant = (eachDayOfInterval({
    start: new Date(group.startDate),
    end: new Date(group.endDate)
  }).length * group.config.numberOfShiftsPerDay) - group.config.numberOfOffDays;

  // Assign participants to shifts
  participants.forEach(participant => {
    let assignedShifts = 0;

    while (assignedShifts < shiftsPerParticipant) {
      const randomShiftIndex = Math.floor(Math.random() * initialSchedule.length);
      const originalShift = initialSchedule[randomShiftIndex];

      // Create a new object with the same properties as the original object,
      // but with a writable participants property
      const randomShift = {
        ...originalShift,
        participants: [...originalShift.participants],
      };

      if (randomShift.participants.length < randomShift.config.maxParticipants) {
        randomShift.participants.push(participant);
        initialSchedule[randomShiftIndex] = randomShift;
        assignedShifts++;
      }
    }
    return;
  });



  return initialSchedule;
};


