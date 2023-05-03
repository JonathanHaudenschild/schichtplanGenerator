const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getGroups,
    createGroup,
    getGroupById,
    updateGroup,
    deleteGroup,
    generateShifts
  } = require('../controllers/groupController');

router.get('/', authMiddleware, getGroups);
router.post('/', authMiddleware, createGroup);
router.get('/:groupId', authMiddleware, getGroupById);
router.put('/:groupId', authMiddleware, updateGroup);
router.delete('/:groupId', authMiddleware, deleteGroup);
router.post('/:groupId/generateShifts', authMiddleware, generateShifts);
module.exports = router;
