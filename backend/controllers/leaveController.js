const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Employee)
const applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

    if (totalDays <= 0) {
        return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check user's leave balance
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Leave Balance Check: User has ${user.leaveBalance} days, requesting ${totalDays} days`);

    if (user.leaveBalance < totalDays) {
        console.log('BLOCKING: Insufficient leave balance');
        return res.status(400).json({
            message: `Insufficient leave balance. You have ${user.leaveBalance} days available, but requested ${totalDays} days.`
        });
    }

    // Check for overlapping leaves
    const overlappingLeave = await Leave.findOne({
        userId: req.user.id,
        status: { $in: ['Pending', 'Approved'] },
        $or: [
            {
                startDate: { $lte: end },
                endDate: { $gte: start }
            }
        ]
    });

    if (overlappingLeave) {
        return res.status(400).json({ message: 'You already have a Pending or Approved leave during this period' });
    }

    const leave = await Leave.create({
        userId: req.user.id,
        leaveType,
        startDate,
        endDate,
        totalDays,
        reason,
        status: 'Pending'
    });

    res.status(201).json(leave);
};

// @desc    Get user leaves
// @route   GET /api/leaves/my-leaves
// @access  Private
const getMyLeaves = async (req, res) => {
    const leaves = await Leave.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
};

// @desc    Get all leaves (Admin)
// @route   GET /api/leaves
// @access  Private (Admin)
const getAllLeaves = async (req, res) => {
    const leaves = await Leave.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
    res.status(200).json(leaves);
};

// Helper function to generate premium email HTML
const generateEmailHtml = (title, message, status, statusColor, leave, remainingBalance = null) => {
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    const balanceRow = remainingBalance !== null ? `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7; color: #718096; font-weight: 500;">Remaining Balance</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7; color: #2d3748; font-weight: 600; text-align: right;">${remainingBalance} Days</td>
        </tr>
    ` : '';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 35px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; margin-bottom: 24px; color: #1a202c; font-weight: 600; }
            .message { color: #4a5568; margin-bottom: 30px; font-size: 16px; }
            
            .status-badge { 
                display: inline-block;
                padding: 8px 16px; 
                background-color: ${statusColor}15; 
                color: ${statusColor}; 
                border-radius: 50px; 
                font-weight: 700; 
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 30px;
                border: 1px solid ${statusColor}30;
            }

            .details-box { background-color: #f8fafc; border-radius: 8px; padding: 25px; border: 1px solid #e2e8f0; }
            .details-table { width: 100%; border-collapse: collapse; }
            .details-table td { padding: 12px 0; border-bottom: 1px solid #edf2f7; font-size: 15px; }
            .details-table td:first-child { color: #718096; font-weight: 500; width: 40%; }
            .details-table td:last-child { color: #2d3748; font-weight: 600; text-align: right; }
            .details-table tr:last-child td { border-bottom: none; }

            .footer { background-color: #f7fafc; padding: 25px; text-align: center; color: #a0aec0; font-size: 13px; border-top: 1px solid #edf2f7; }
            .footer p { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>HR Notification</h1>
            </div>
            <div class="content">
                <p class="greeting">Hello ${leave.userId.fullName},</p>
                
                <div style="text-align: center;">
                    <div class="status-badge">
                        ${status}
                    </div>
                </div>

                <p class="message">${message}</p>
                
                <div class="details-box">
                    <table class="details-table">
                        <tr>
                            <td>Leave Type</td>
                            <td>${leave.leaveType}</td>
                        </tr>
                        <tr>
                            <td>Duration</td>
                            <td>${leave.totalDays} Day${leave.totalDays > 1 ? 's' : ''}</td>
                        </tr>
                        <tr>
                            <td>Start Date</td>
                            <td>${formatDate(leave.startDate)}</td>
                        </tr>
                        <tr>
                            <td>End Date</td>
                            <td>${formatDate(leave.endDate)}</td>
                        </tr>
                        ${balanceRow}
                    </table>
                </div>

                <p style="margin-top: 30px; color: #718096; text-align: center; font-size: 14px;">
                    This is an automated message. Please do not reply directly to this email.
                </p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Mini HR Tool. All rights reserved.</p>
                <p>Human Resources Department</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private (Admin)
const updateLeaveStatus = async (req, res) => {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const leaveId = req.params.id;

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const leave = await Leave.findById(leaveId).populate('userId', 'fullName email leaveBalance');

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ message: `Leave request is already ${leave.status}` });
        }

        let emailSubject = '';
        let emailMessage = '';
        let statusColor = '#718096'; // Default gray
        let remainingBalance = null;

        if (status === 'Approved') {
            const user = await User.findById(leave.userId._id);

            // Re-check balance just in case
            if (user.leaveBalance < leave.totalDays) {
                return res.status(400).json({
                    message: `Insufficient leave balance. User has ${user.leaveBalance} days, request needs ${leave.totalDays}.`
                });
            }

            user.leaveBalance -= leave.totalDays;
            await user.save();

            // Update local ref for email
            remainingBalance = user.leaveBalance;

            emailSubject = 'Leave Request Approved ✅';
            emailMessage = 'We are pleased to inform you that your leave request has been approved.';
            statusColor = '#48bb78'; // Green
        } else if (status === 'Rejected') {
            emailSubject = 'Leave Request Update';
            emailMessage = 'Your leave request has been reviewed and was not approved at this time.';
            statusColor = '#e53e3e'; // Red
        }

        leave.status = status;
        await leave.save();

        // Send Email
        if (leave.userId && leave.userId.email) {
            const htmlContent = generateEmailHtml(
                emailSubject,
                emailMessage,
                status,
                statusColor,
                leave,
                remainingBalance
            );

            await sendEmail(
                leave.userId.email,
                emailSubject,
                `Your leave status has been updated to: ${status}`,
                htmlContent
            );
        }

        res.status(200).json(leave);

    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ message: 'Server error while updating leave status' });
    }
};

// @desc    Cancel leave request
// @route   PUT /api/leaves/:id/cancel
// @access  Private (Employee)
const cancelLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        if (leave.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending requests can be cancelled' });
        }

        leave.status = 'Cancelled';
        await leave.save();

        res.status(200).json(leave);
    } catch (error) {
        console.error('Error cancelling leave:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
    cancelLeave
};
