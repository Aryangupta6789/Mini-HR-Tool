const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Storing as YYYY-MM-DD string for easy querying/uniqueness
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    }
}, {
    timestamps: true
});

// Ensure one record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
