const express = require('express');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../middlewares/authMiddleware');

const {
  getParticipants,
  createParticipant,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} = require('../controllers/participantController');

router.get('/', authMiddleware, getParticipants);
router.post('/', authMiddleware, createParticipant);
router.get('/:participantId', authMiddleware, getParticipantById);
router.put('/:participantId', authMiddleware, updateParticipant);
router.delete('/:participantId', authMiddleware, deleteParticipant);

module.exports = router;
