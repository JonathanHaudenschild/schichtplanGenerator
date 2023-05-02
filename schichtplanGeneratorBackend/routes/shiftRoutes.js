const express = require('express');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getShifts,
    createShift,
    getShiftById,
    updateShift,
    deleteShift,
} = require('../controllers/shiftController');

router.get('/', authMiddleware, getShifts);
router.post('/', authMiddleware, createShift);
router.get('/:shiftId', authMiddleware, getShiftById);
router.put('/:shiftId', authMiddleware, updateShift);
router.delete('/:shiftId', authMiddleware, deleteShift);

module.exports = router;
