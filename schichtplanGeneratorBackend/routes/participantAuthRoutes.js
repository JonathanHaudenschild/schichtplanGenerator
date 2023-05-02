const express = require('express');
const router = express.Router();

const {
  signIn,
  updateProfile,
} = require('../controllers/participantAuthController');

router.post('/signin', signIn);
router.put('/:participantToken/profile', updateProfile);

module.exports = router;
