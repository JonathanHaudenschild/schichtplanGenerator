const Participant = require('../models/participantSchema');

exports.getParticipants = async (req, res) => {
  try {
    const { groupId } = req.params;
    const participants = await Participant.find({ group: groupId });

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the participants.' });
  }
};

exports.createParticipant = async (req, res) => {
  try {
    const { groupId } = req.params;
    const newParticipant = new Participant({ ...req.body, group: groupId });
    const participant = await newParticipant.save();

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the participant.' });
  }
};

exports.getParticipantById = async (req, res) => {
  try {
    const { groupId, participantId } = req.params;
    const participant = await Participant.findOne({ _id: participantId, group: groupId });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found.' });
    }

    res.status(200).json(participant);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the participant.' });
  }
};

exports.updateParticipant = async (req, res) => {
  try {
    const { groupId, participantId } = req.params;
    const updateData = req.body;
    const participant = await Participant.findOneAndUpdate(
      { _id: participantId, group: groupId },
      updateData,
      { new: true }
    );

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found.' });
    }

    res.status(200).json(participant);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the participant.' });
  }
};

exports.deleteParticipant = async (req, res) => {
  try {
    const { groupId, participantId } = req.params;
    const participant = await Participant.findOneAndDelete({ _id: participantId, group: groupId });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found.' });
    }

    res.status(200).json({ message: 'Participant deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the participant.' });
  }
};
