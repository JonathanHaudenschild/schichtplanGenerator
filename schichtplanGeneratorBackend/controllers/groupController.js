const { differenceInMilliseconds, isSameDay, eachDayOfInterval, isAfter, isBefore } = require('date-fns');
const Group = require('../models/groupSchema');
const Participant = require('../models/participantSchema');
const Shift = require('../models/shiftSchema');
const { getShifts } = require('./shiftController');
const User = require('../models/userSchema');

const initGroup = {
  groupName: '',
  participants: [],
  shifts: [],
  schedule: [],
  startDate: new Date(),
  endDate: new Date(),
  config: {
    isArchived: false,
    allowSwapping: false,
    numberOfShiftsPerDay: 0,
    minTimeBetweenShifts: 0,
    numberOfOffDays: 1,
    minParticipantsPerShift: 4,
    maxParticipantsPerShift: 8,
    minSupervisorsPerShift: 2,
    maxSupervisorsPerShift: 2,
  },
}


exports.getGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const groups = await Group.find({ _id: { $in: user.groups } }); // Find groups that the user belongs to

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get the authenticated user's information

    const newGroupObject = {
      ...initGroup,
      ...req.body,
    }
    console.log(newGroupObject);
    delete newGroupObject._id;

    if (isAfter(newGroupObject.startDate, newGroupObject.endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const newGroup = new Group(newGroupObject);

    const savedGroup = await newGroup.save();
    user.groups.push(savedGroup._id); // Add the new group to the user's groups
    await user.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(req.params.groupId);
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(group._id)) {
      return res.status(403).json({ error: 'You are not authorized to view this group' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    // check if group is in user's groups
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(group._id)) {
      return res.status(403).json({ error: 'You are not authorized to update this group' });
    }
    const newGroupObject = {
      ...group.toObject(),
      ...req.body,
    }
    console.log(group, req.body);
    const updatedGroup = await Group.findByIdAndUpdate(group._id, newGroupObject, { new: true });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    // check if group is in user's groups
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(group._id)) {
      return res.status(403).json({ error: 'You are not authorized to delete this group' });
    }
    const deletedGroup = await Group.findByIdAndDelete(req.params.groupId);
    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateShifts = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    // check if group is in user's groups
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(group._id)) {
      return res.status(403).json({ error: 'You are not authorized to generateShifts for this group' });
    }
    // 1. Load the group, participants, and current shifts
    const participants = await Participant.find({ group: groupId }).populate(['friends', 'enemies']);
    const shifts = await Shift.find({ group: groupId }).sort({ order: 1 }).populate('participants');

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
  if (isBefore(currentShift.endDate, arrivalTime) || isAfter(currentShift.startDate, departureTime)) {
    return false;
  }

  // Check if the participant has an absence on the given day
  for (const absence of absences) {
    if (
      (isBefore(currentShift.startDate, absence.startDate) && isAfter(currentShift.endDate, absence.startDate)) ||
      (isBefore(currentShift.startDate, absence.endDate) && isAfter(currentShift.endDate, absence.endDate)) ||
      (isAfter(currentShift.startDate, absence.startDate) && isBefore(currentShift.startDate, absence.endDate)) ||
      (isAfter(currentShift.endDate, absence.startDate) && isBefore(currentShift.endDate, absence.endDate)) ||
      (isAfter(currentShift.startDate, absence.startDate) && isBefore(currentShift.endDate, absence.endDate)) ||
      (isBefore(currentShift.startDate, absence.startDate) && isAfter(currentShift.endDate, absence.endDate))
    ) {
      return false;
    }
  }
  return true;
}

const checkMinTimeBetweenShifts = (participant, currentShift, minBreakTimeBetween = 2) => {

  // If there's no last assigned shift, this participant is eligible for a new shift
  if (participant.shifts.length === 0) {
    return true;
  }
  const filteredShifts = participant.shifts.filter(shift => shift._id !== currentShift._id);

  return filteredShifts.every(shift => {
    const timeBetweenShifts = differenceInMilliseconds(currentShift.startDate, shift.endDate);
    return timeBetweenShifts > minBreakTimeBetween;
  });
};

const checkOffDays = (participant, currentShift, numberOfOffDays = 1) => {
  const offDays = participant.offDays.slice(0, numberOfOffDays);

  // Check if the day is not within the participant's desired offDays
  for (const offDay of offDays) {
    const offDayDate = new Date(offDay);
    if (isSameDay(currentShift.startDate, offDayDate) || isSameDay(currentShift.endDate, offDayDate)) {
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
const checkEnemies = (participant, currentShift) => {
  const filteredParticipants = currentShift.participants.filter(p => p.participantToken.toString() !== participant.participantToken.toString());
  return !(
    (filteredParticipants.some(p => participant.enemies.includes(p.participantToken.toString()))) ||
    (filteredParticipants.some(p => participant.enemies.includes(p.displayName.toString())) ||
      filteredParticipants.some(p => (participant.enemies.includes(p.realName.toString()))))
  )
};

const checkFriends = (participant, currentShift) => {
  const filteredParticipants = currentShift.participants.filter(p => p.participantToken.toString() !== participant.participantToken.toString());
  return (filteredParticipants.some(p => participant.friends.includes(p.participantToken.toString()))) ||
    (filteredParticipants.some(p => participant.friends.includes(p.displayName.toString()))) ||
    (filteredParticipants.some(p => participant.friends.includes(p.realName.toString())))

};

const checkExperienceMixing = (participant, currentShift) => {
  let experiencedCount = 0;
  const filteredParticipants = currentShift.participants.filter(p => p.participantToken.toString() !== participant.participantToken.toString());
  for (const otherParticipant of filteredParticipants) {
    experiencedCount += otherParticipant.experience;
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

const checkShiftPreferences = (participant, currentShift) => participant.shiftPreferences.includes(currentShift.type);

const checkCategoryMatchesRole = (participant, currentShift) => {
  return currentShift.category === participant.role
};


const checkParticipantsPerShift = (currentShift) => {
  const minParticipants = currentShift.config.minParticipants;
  const maxParticipants = currentShift.config.maxParticipants;
  const numberOfParticipants = currentShift.participants.length;

  return numberOfParticipants >= minParticipants && numberOfParticipants <= maxParticipants;
};


const calculateCost = (schedule) => {
  let cost = 0;
  schedule.forEach((currentShift) => {
    currentShift.participants.forEach((participant) => {
      const day = shift.day;

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


const generateRandomNeighbor = (newSchedule) => {
  const numberOfShifts = newSchedule.length;

  // Choose two random shifts
  const shiftIndex1 = Math.floor(Math.random() * numberOfShifts);
  const shiftIndex2 = Math.floor(Math.random() * numberOfShifts);

  // Choose one random participant from each shift
  const participantIndex1 = Math.floor(Math.random() * newSchedule[shiftIndex1].participants.length);
  const participantIndex2 = Math.floor(Math.random() * newSchedule[shiftIndex2].participants.length);

  // Swap participants between the two shifts
  const temp = newSchedule[shiftIndex1].participants[participantIndex1];

  if (newSchedule[shiftIndex2].participants.length < (newSchedule[shiftIndex2].config.maxParticipants - 1)
    && newSchedule[shiftIndex1].participants.length > (newSchedule[shiftIndex1].config.minParticipants + 1)
  ) {
    newSchedule[shiftIndex2].participants.push(temp);
    newSchedule[shiftIndex1].participants.splice(participantIndex1, 1);
  } else {
    newSchedule[shiftIndex1].participants[participantIndex1] = newSchedule[shiftIndex2].participants[participantIndex2];
    newSchedule[shiftIndex2].participants[participantIndex2] = temp;
  }

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

  const shiftsPerParticipant = (eachDayOfInterval({
    start: new Date(group.startDate),
    end: new Date(group.endDate)
  }).length * group.numberOfShiftsPerDay) - group.numberOfOffDays;

  // Assign participants to shifts
  participants.forEach(participant => {
    let assignedShifts = 0;
    while (assignedShifts < shiftsPerParticipant) {
      const randomShift = Math.floor(Math.random() * initialSchedule.length);
      if (initialSchedule[randomShift].participants.length < initialSchedule[randomShift].config.maxParticipants) {
        initialSchedule[randomShift].participants.push(participant);
        assignedShifts++;
      }
    }
    return;
  });

  return initialSchedule;
};

// Data structures
const generatedShifts = [];