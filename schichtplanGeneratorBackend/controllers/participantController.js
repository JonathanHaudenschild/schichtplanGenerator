const Group = require('../models/groupSchema');
const Participant = require('../models/participantSchema');
const User = require('../models/userSchema');

const initParticipant =
{
  participantToken: '',
  displayName: '',
  group: null,
  color: '',
  offDays: [],
  friends: [],
  enemies: [],
  shiftPreferences: 0,
  experience: 0,
  arrivalTime: new Date(),
  departureTime: new Date(),
  absences: [],
  shifts: [],
  shiftsOpenForSwap: [],
  role: 0,
  logs: null,
  config: {
    canEdit: false,
    canSwap: false,
  },
}
exports.getParticipants = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId).populate('participants');
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to view these participants' });
    }

    const participants = group.participants;

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the participants.' });
  }
};

exports.createParticipant = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId).populate('participants');
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }
    // check if a participant with the same participation token already exists
    group.participants.forEach(participant => {
      if (participant.participantToken === req.body.participantToken) {
        return res.status(400).json({ error: 'A participant with the same participation token already exists' });
      }
    });

    const generateParticipationToken = () => {
      return Math.random().toString(36).substring(3, 7).toUpperCase().padStart(4, '0');
    }


    if (req.body.participantToken === '') {
      req.body.participantToken = generateParticipationToken();
    }
    if (req.body.displayName === '') {
      req.body.displayName = req.body.participantToken;
    }
    const newParticipant = new Participant({ ...initParticipant, ...req.body, group: groupId });
    const participant = await newParticipant.save();

    group.participants.push(participant._id);
    await group.save();
    res.status(201).json(participant);
  } catch (error) {
    console.log(error)
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
