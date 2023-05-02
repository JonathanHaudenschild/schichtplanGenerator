const Participant = require("../models/participantSchema");

const isParticipant = async (req, res, next) => {
  try {
    const participant = await Participant.findById(req.participant.participantToken);
    if (!participant) {
      return res.status(401).json({ message: "Not authorized" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = isParticipant;