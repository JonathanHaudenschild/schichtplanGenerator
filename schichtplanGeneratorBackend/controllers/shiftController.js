const Shift = require('../models/shiftSchema');

exports.getShifts = async (req, res) => {
    try {
      const { groupId } = req.params;
  
      const shifts = await Shift.find({ group: groupId }).sort({ day: 1, order: 1 });
  
      res.status(200).json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the shifts.' });
    }
  };
  
  

exports.createShift = async (req, res) => {
  try {
    const { groupId } = req.params;
    const newShift = new Shift({ ...req.body, group: groupId });
    const shift = await newShift.save();

    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the shift.' });
  }
};

exports.getShiftById = async (req, res) => {
  try {
    const { groupId, shiftId } = req.params;
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
    const updateData = req.body;
    const shift = await Shift.findOneAndUpdate(
      { _id: shiftId, group: groupId },
      updateData,
      { new: true }
    );

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found.' });
    }

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the shift.' });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { groupId, shiftId } = req.params;
    const shift = await Shift.findOneAndDelete({ _id: shiftId, group: groupId });

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found.' });
    }

    res.status(200).json({ message: 'Shift deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the shift.' });
  }
};
