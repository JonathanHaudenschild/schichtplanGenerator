const Participant = require('../models/participantSchema');

exports.signIn = async (req, res) => {
    try {
        const { participantToken } = req.body;
        const participant = await Participant.findOne({ participantToken });

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found.' });
        }

        res.status(200).json(participant);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while signing in.' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { participantToken } = req.params;
        const updateData = req.body;

        const participant = await Participant.findOne({ participantToken });

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found.' });
        }

        if (!participant.config.canEdit) {
            return res.status(403).json({ message: 'You are not allowed to edit this profile.' });
        }

        const updatedParticipant = await Participant.findOneAndUpdate(
            { participantToken },
            updateData,
            { new: true }
        );

        res.status(200).json(updatedParticipant);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the profile.' });
    }
};
