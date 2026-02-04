const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// @desc    Get monthly report for all employees
// @route   GET /api/reports/monthly
// @access  Private/Admin
const getMonthlyReport = async (req, res) => {
    try {
        const { month, year } = req.query;

        // Default to current month if not provided
        const currentDate = new Date();
        const reportMonth = month || String(currentDate.getMonth() + 1).padStart(2, '0');
        const reportYear = year || String(currentDate.getFullYear());

        // Calculate start and end dates for the month
        const startDate = new Date(`${reportYear}-${reportMonth}-01`);
        const endDate = new Date(reportYear, reportMonth, 0); // Last day of month

        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Get all users (employees only)
        const users = await User.find({ role: 'employee' }).select('fullName email dateOfJoining');

        // Generate reports for each user
        const reports = await Promise.all(users.map(async (user) => {
            // Fetch attendance records for the month
            const attendanceRecords = await Attendance.find({
                userId: user._id,
                date: { $gte: startDateStr, $lte: endDateStr }
            });

            // Fetch leave records for the month
            const leaveRecords = await Leave.find({
                userId: user._id,
                $or: [
                    { startDate: { $lte: endDateStr }, endDate: { $gte: startDateStr } }
                ]
            });

            // Calculate total working days (excluding weekends if needed, for now all days)
            const totalDaysInMonth = endDate.getDate();

            // Calculate attendance stats
            const presentDays = attendanceRecords.filter(a => a.status === 'Present').length;
            const absentDays = attendanceRecords.filter(a => a.status === 'Absent').length;
            const attendancePercentage = attendanceRecords.length > 0
                ? ((presentDays / attendanceRecords.length) * 100).toFixed(2)
                : 0;

            // Calculate leave stats
            const leavesByType = {
                casual: 0,
                sick: 0,
                paid: 0
            };

            const leavesByStatus = {
                approved: 0,
                pending: 0,
                rejected: 0
            };

            let totalLeaveDays = 0;

            leaveRecords.forEach(leave => {
                // Count by type
                if (leave.leaveType === 'Casual') leavesByType.casual++;
                if (leave.leaveType === 'Sick') leavesByType.sick++;
                if (leave.leaveType === 'Paid') leavesByType.paid++;

                // Count by status
                if (leave.status === 'Approved') {
                    leavesByStatus.approved++;
                    totalLeaveDays += leave.totalDays || 0;
                }
                if (leave.status === 'Pending') leavesByStatus.pending++;
                if (leave.status === 'Rejected') leavesByStatus.rejected++;
            });

            return {
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                attendance: {
                    totalDays: totalDaysInMonth,
                    recordedDays: attendanceRecords.length,
                    present: presentDays,
                    absent: absentDays,
                    percentage: parseFloat(attendancePercentage)
                },
                leaves: {
                    total: leaveRecords.length,
                    totalDays: totalLeaveDays,
                    casual: leavesByType.casual,
                    sick: leavesByType.sick,
                    paid: leavesByType.paid,
                    approved: leavesByStatus.approved,
                    pending: leavesByStatus.pending,
                    rejected: leavesByStatus.rejected
                }
            };
        }));

        res.json({
            month: reportMonth,
            year: reportYear,
            monthName: new Date(`${reportYear}-${reportMonth}-01`).toLocaleString('default', { month: 'long' }),
            reports
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while generating report' });
    }
};

module.exports = {
    getMonthlyReport
};
