const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    },
    dateOfJoining: {
        type: Date,
        default: Date.now
    },
    leaveBalance: {
        type: Number,
        default: 20
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
