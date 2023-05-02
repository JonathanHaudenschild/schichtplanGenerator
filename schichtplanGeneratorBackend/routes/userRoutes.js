const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, deleteProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.delete('/me', authMiddleware, deleteProfile);

module.exports = router;
