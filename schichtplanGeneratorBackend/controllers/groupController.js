const Group = require('../models/groupSchema');
const Participant = require('../models/participantSchema');
const Shift = require('../models/shiftSchema');
const { getShifts } = require('./shiftController');

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const newGroup = new Group(req.body);
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(req.params.groupId, req.body, { new: true });
    if (!updatedGroup) return res.status(404).json({ error: 'Group not found' });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateShifts = async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Load the group, participants, and current shifts
    const group = await Group.findById(groupId);
    const participants = await Participant.find({ group: groupId }).populate('friends');
    const shifts = await Shift.find({ group: groupId }).sort({ day: 1, order: 1 }).populate('participants');

    // 2. Prepare data structures and helper functions for shift generation

    const initialSchedule = generateInitialSchedule(group, participants, shifts); // Implement this function to generate an initial schedule
    const initialTemperature = 1000;
    const coolingRate = 0.99;
    const numIterations = 10000;
    const bestSchedule = simulatedAnnealing(initialSchedule, initialTemperature, coolingRate, numIterations);

    await Group.findByIdAndUpdate(groupId, { schedule: bestSchedule });
    console.log('bestSchedule', bestSchedule);
    // 5. Return the generated shifts
    res.status(200).json(bestSchedule);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while generating the shifts.' });
  }
};


// Helper functions
const checkArrivalDepartureAbsences = (participant, currentShift) => {
  const arrivalTime = participant.arrivalTime;
  const departureTime = participant.departureTime;
  const absences = participant.absences;

  // Check if the participant's arrivalTime and departureTime allow them to be assigned on the given day
  if (currentShift.day < arrivalTime || currentShift.day > departureTime) {
    return false;
  }

  // Check if the participant has an absence on the given day
  for (const absence of absences) {
    if (currentShift.day >= absence.startDate && currentShift.day <= absence.endDate) {
      return false;
    }
  }

  return true;
};

const checkOffShiftsBetween = (participant, currentShift, minNumberOfShiftsBetween = 0) => {

  // If there's no last assigned shift, this participant is eligible for a new shift
  if (participant.shifts.length === 0) {
    return true;
  }

  const lastAssignedShift = participant.shifts[participant.shifts.length - 1];
  const numberOfShiftsBetween = currentShift.order - lastAssignedShift.order;

  // Check if the minimum number of off shifts between the participant's shifts is satisfied
  return numberOfShiftsBetween > minNumberOfShiftsBetween;
};

const checkOffDays = (participant, currentShift, numberOfOffDays = 1) => {
  const offDays = participant.offDays.slice(0, numberOfOffDays);

  // Check if the day is not within the participant's desired offDays
  for (const offDay of offDays) {
    const offDayDate = new Date(offDay);
    if (currentShift.day.toDateString() === offDayDate.toDateString()) {
      return false;
    }
  }

  // If the day is not found in the participant's offDays, return true
  return true;
};




const checkEnemies = (participant, currentShift) => {
  const participantEnemies = participant.enemies;

  // Check if the participant has no enemies within the shift
  for (const enemyParticipantToken of participantEnemies) {
    for (const assignedParticipant of currentShift.participants) {
      if (assignedParticipant.participantToken.toString() === enemyParticipantToken.toString()) {
        return false;
      }
    }
  }

  // If no enemies are found in the shift, return true
  return true;
};

const checkExperienceMixing = (participant, currentShift) => {
  let experiencedCount = 0;
  for (const participant of currentShift.participants) {
    experiencedCount += participant.experience;
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

const checkFriends = (participant, currentShift) => {
  for (const friendId of participant.friends) {
    if (currentShift.participants.some(participant => participant._id.toString() === friendId)) {
      return true;
    }

  }
  return false;
};

const checkShiftPreferences = (participant, currentShift) => {
  const shiftPreferences = participant.config.shiftPreferences;

  if (shiftPreferences.isNightShift && !currentShift.config.isNightShift) return false;
  // if (shiftPreferences.isDayShift && !currentShift.config.isDayShift) return false;
  if (shiftPreferences.isEarlyShift && !currentShift.config.isEarlyShift) return false;
  if (shiftPreferences.isLateShift && !currentShift.config.isLateShift) return false;

  return true;
};

const checkParticipantsPerShift = (currentShift) => {
  const minParticipants = currentShift.config.minParticipants;
  const maxParticipants = currentShift.config.maxParticipants;
  const numberOfParticipants = currentShift.participants.length;

  return numberOfParticipants >= minParticipants && numberOfParticipants <= maxParticipants;
};

const calculateCost = (group) => {
  let cost = 0;

  group.schedule.forEach((currentShift) => {
    currentShift.participants.forEach((participant) => {
      const day = shift.day;

      if (!checkArrivalDepartureAbsences(participant, currentShift)) {
        cost += 5000; // High priority
      }
      if (!checkOffShiftsBetween(participant, currentShift, group.config.minNumberOfShiftsBetween)) {
        cost += 2000;
      }
      if (!checkEnemies(participant, currentShift)) {
        cost += 1000;
      }
      if (!checkOffDays(participant, currentShift, group.config.numberOfOffDays)) {
        cost += 600;
      }
      if (!checkExperienceMixing(schedule.participants, currentShift)) {
        cost += 300;
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


const generateRandomNeighbor = (group) => {
  const newSchedule = group.schedule;
  const numberOfShifts = newSchedule.length;

  // Choose two random shifts
  const shiftIndex1 = Math.floor(Math.random() * numberOfShifts);
  const shiftIndex2 = Math.floor(Math.random() * numberOfShifts);

  // Choose one random participant from each shift
  const participantIndex1 = Math.floor(Math.random() * newSchedule[shiftIndex1].participants.length);
  const participantIndex2 = Math.floor(Math.random() * newSchedule[shiftIndex2].participants.length);

  // Swap participants between the two shifts
  const temp = newSchedule[shiftIndex1].participants[participantIndex1];
  newSchedule[shiftIndex1].participants[participantIndex1] = newSchedule[shiftIndex2].participants[participantIndex2];
  newSchedule[shiftIndex2].participants[participantIndex2] = temp;

  return newSchedule;
};


const simulatedAnnealing = (initialSchedule, initialTemperature, coolingRate, numIterations) => {
  let currentSchedule = initialSchedule;
  let currentCost = calculateCost(currentSchedule);
  let bestSchedule = currentSchedule;
  let bestCost = currentCost;
  let temperature = initialTemperature;

  for (let i = 0; i < numIterations; i++) {
    const newSchedule = generateRandomNeighbor(currentSchedule);
    const newCost = calculateCost(newSchedule);
    const costDifference = newCost - currentCost;

    if (costDifference <= 0 || Math.random() < Math.exp(-costDifference / temperature)) {
      currentSchedule = newSchedule;
      currentCost = newCost;

      if (currentCost < bestCost) {
        bestCost = currentCost;
        bestSchedule = currentSchedule;
      }
    }

    temperature *= coolingRate;
  }

  return bestSchedule;
};

const generateInitialSchedule = (group, participants, shifts) => {
  const initialSchedule = [];

  // Initialize the schedule with empty shifts
  shifts.forEach(shift => {
    initialSchedule.push(shift);
  });

  // Assign participants to shifts
  participants.forEach(participant => {
    let assignedShifts = 0;
    initialSchedule.forEach((currentShift, index) => {
      // Check if the participant can be assigned to the shift based on the constraints
      if (
        checkArrivalDepartureAbsences(participant, currentShift) &&
        checkOffShiftsBetween(participant, currentShift, group.config.minNumberOfShiftsBetween) &&
        checkEnemies(participant, currentShift) &&
        checkParticipantsPerShift(currentShift)
      ) {
        initialSchedule[index].participants.push(participant);
        assignedShifts++;
      }
      // Stop assigning shifts if the participant has reached the maximum number of shifts per day
      if (assignedShifts >= groups.numberOfShiftsPerDay) {
        return;
      }
    });
  });

  return initialSchedule;
};

// Data structures
const generatedShifts = [];