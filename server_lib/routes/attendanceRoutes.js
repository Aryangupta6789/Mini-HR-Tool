const express = require('express');
const router = express.Router();
const { markAttendance, getMyAttendance, getAllAttendance } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, markAttendance);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/', protect, admin, getAllAttendance);

module.exports = router;
