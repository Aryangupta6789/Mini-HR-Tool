const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, cancelLeave } = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/', protect, admin, getAllLeaves);
router.put('/:id', protect, admin, updateLeaveStatus);
router.put('/:id/cancel', protect, cancelLeave);

module.exports = router;
