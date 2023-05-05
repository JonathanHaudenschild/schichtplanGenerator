const Shift = require('../models/shiftSchema');

const initShift = {
  shiftName: '',
  group: null,
  participants: [],
  startDate: new Date(),
  endDate: new Date(),
  category: 0,
  type: 0,
  experienceLevel: 0,
  config: {
    isLocked: false,
    disableSwap: false,
    minParticipants: 0,
    maxParticipants: 8,
    minSupervisors: 1,
    maxSupervisors: 2,
  }
}


exports.getShifts = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId).populate('participants');
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to view these shifts' });
    }

    const shifts = await Shift.find({ group: groupId });

    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the shifts.' });
  }
};



exports.createShift = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId).populate('participants');
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }


    const newShiftObject = {
      ...initShift, ...req.body, group: groupId
    }

    if (isAfter(newGroupObject.startDate, newGroupObject.endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }


    delete newShiftObject._id;

    const newShift = new Shift(newShiftObject);
    const shift = await newShift.save();
    group.shifts.push(shift._id);
    await group.save();

    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the shift.' });
  }
};

exports.getShiftById = async (req, res) => {
  try {
    const { groupId, shiftId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId);
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }

    const shift = await Shift.findOne({ _id: shiftId, group: groupId });

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found.' });
    }

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the shift.' });
  }
};

exports.updateShift = async (req, res) => {
  try {
    const { groupId, shiftId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId);
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }


    if (!shift) {
      return res.status(404).json({ message: 'Shift not found.' });
    }
    const newShiftObject = {
      ...shift.toObject(),
      ...req.body,
    }

    const updatedShift = await Shift.findOneAndUpdate(
      { _id: shiftId, group: groupId },
      newShiftObject,
      { new: true }
    );
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the shift.' });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { groupId, shiftId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId);
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }

    const shift = await Shift.findOneAndDelete({ _id: shiftId, group: groupId });

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found.' });
    }

    res.status(200).json({ message: 'Shift deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the shift.' });
  }
};
