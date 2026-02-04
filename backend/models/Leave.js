const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Casual', 'Sick', 'Paid'],
        required: [true, 'Please specify leave type']
    },
    startDate: {
        type: Date,
        required: [true, 'Please add start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add end date']
    },
    totalDays: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    reason: {
        type: String
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Leave', leaveSchema);
