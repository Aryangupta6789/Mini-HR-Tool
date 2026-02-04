const Attendance = require('../models/Attendance');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private (Employee)
const markAttendance = async (req, res) => {
    const { status } = req.body; // 'Present' or 'Absent'
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (!['Present', 'Absent'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const existingAttendance = await Attendance.findOne({
        userId: req.user.id,
        date
    });

    if (existingAttendance) {
        return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const attendance = await Attendance.create({
        userId: req.user.id,
        date,
        status
    });

    res.status(201).json(attendance);
};

// @desc    Get user attendance history
// @route   GET /api/attendance/my-attendance
// @access  Private
const getMyAttendance = async (req, res) => {
    const attendance = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(attendance);
};

// @desc    Get all attendance records (Admin)
// @route   GET /api/attendance
// @access  Private (Admin)
const getAllAttendance = async (req, res) => {
    const attendance = await Attendance.find().populate('userId', 'fullName email').sort({ date: -1 });
    res.status(200).json(attendance);
};

module.exports = {
    markAttendance,
    getMyAttendance,
    getAllAttendance
};
