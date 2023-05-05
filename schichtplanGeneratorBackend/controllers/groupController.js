const { differenceInMilliseconds, isSameDay, eachDayOfInterval, isAfter, isBefore } = require('date-fns');
const Group = require('../models/groupSchema');
const Participant = require('../models/participantSchema');
const Shift = require('../models/shiftSchema');
const { getShifts } = require('./shiftController');
const User = require('../models/userSchema');

const initGroup = {
  groupName: '',
  participants: [],
  description: '',
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
    delete newGroupObject._id;

    if (isAfter(new Date(newGroupObject.startDate), new Date(newGroupObject.endDate))) {
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
    const shifts = await Shift.find({ group: groupId }).populate('participants');

    // 2. Prepare data structures and helper functions for shift generation
    const initialSchedule = generateInitialSchedule(group, participants, shifts); // Implement this function to generate an initial schedule
    const initialTemperature = 100;
    const coolingRate = 0.99;
    const numIterations = 100;

    const bestSchedule = simulatedAnnealing(initialSchedule, initialTemperature, coolingRate, numIterations, group);

    await Group.findByIdAndUpdate(groupId, { schedule: bestSchedule });
    // 5. Return the generated shifts
    res.status(200).json(bestSchedule);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while generating the shifts.' });
  }
};


// Helper functions
const checkArrivalDepartureAbsences = (participant, currentShift) => {
  const arrivalTime = new Date(participant.arrivalTime);
  const departureTime = new Date(participant.departureTime);
  const shiftStart = new Date(currentShift.startDate);
  const shiftEnd = new Date(currentShift.endDate);
  const absences = new Date(participant.absences);

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

const checkMinTimeBetweenShifts = (participant, currentShift, minBreakTimeBetween = 2) => {
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

const checkOffDays = (participant, currentShift, numberOfOffDays = 1) => {
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
const checkEnemies = (participant, currentShift) => {
  const filteredParticipants = currentShift.participants.filter(p => p.participantToken?.toString() !== participant.participantToken.toString());


  return !(
    (filteredParticipants.some(p => participant.enemies.includes(p.participantToken?.toString()))) ||
    (filteredParticipants.some(p => participant.enemies.includes(p.displayName?.toString())) ||
      filteredParticipants.some(p => (participant.enemies.includes(p.realName?.toString()))))
  )
};

const checkFriends = (participant, currentShift) => {
  const filteredParticipants = currentShift.participants.filter(p => p.participantToken?.toString() !== participant.participantToken.toString());
  return (filteredParticipants.some(p => participant.friends.includes(p.participantToken?.toString()))) ||
    (filteredParticipants.some(p => participant.friends.includes(p.displayName?.toString()))) ||
    (filteredParticipants.some(p => participant.friends.includes(p.realName?.toString())))

};

const checkExperienceMixing = (participant, currentShift) => {
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

const checkExperienceLevel = (participant, currentShift) => {
  return currentShift.experienceLevel >= participant.experience;
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


const calculateCost = (schedule, group) => {
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


const generateRandomNeighbor = (newSchedule) => {
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

const moveOrSwapParticipants = (newSchedule, shiftIndex1, participantIndex1, shiftIndex2, participantIndex2) => {
  const temp = newSchedule[shiftIndex1].participants[participantIndex1];

  if (
    newSchedule[shiftIndex2].participants.length < (newSchedule[shiftIndex2].config.maxParticipants - 1) &&
    newSchedule[shiftIndex1].participants.length > (newSchedule[shiftIndex1].config.minParticipants + 1)
  ) {
    // Remove shift from participant
    temp.shifts = temp.shifts.filter(shift => shift._id.toString() !== newSchedule[shiftIndex1]._id.toString());
    // Add shift to participant
    temp.shifts.push(newSchedule[shiftIndex2]);

    // Move the participant to the target shift
    newSchedule[shiftIndex2].participants.push(temp);
    newSchedule[shiftIndex1].participants.splice(participantIndex1, 1);
  } else {
    // Swap shifts between two participants
    const tempShifts1 = newSchedule[shiftIndex1].participants[participantIndex1].shifts;
    const tempShifts2 = newSchedule[shiftIndex2].participants[participantIndex2].shifts;
    // Remove the shifts from each participant's array
    newSchedule[shiftIndex1].participants[participantIndex1].shifts = tempShifts1.filter(shift => shift._id.toString() !== newSchedule[shiftIndex1]._id.toString());
    newSchedule[shiftIndex2].participants[participantIndex2].shifts = tempShifts2.filter(shift => shift._id.toString() !== newSchedule[shiftIndex2]._id.toString());

    // Add the swapped shifts to each participant's array
    newSchedule[shiftIndex1].participants[participantIndex1].shifts.push(newSchedule[shiftIndex2]);
    newSchedule[shiftIndex2].participants[participantIndex2].shifts.push(newSchedule[shiftIndex1]);
  }

  return newSchedule;
}


const simulatedAnnealing = (initialSchedule, initialTemperature, coolingRate, numIterations, group) => {
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
        console.log(bestCost);
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
  }).length * group.config.numberOfShiftsPerDay) - group.config.numberOfOffDays;

  // Assign participants to shifts
  participants.forEach(participant => {
    let assignedShifts = 0;
    while (assignedShifts < shiftsPerParticipant) {
      const randomShift = Math.floor(Math.random() * initialSchedule.length);
      if (initialSchedule[randomShift].participants.length < initialSchedule[randomShift].config.maxParticipants) {
        participant.shifts.push(initialSchedule[randomShift]);
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