const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user (Employee)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: 'employee', // Always default to employee for public registration
        leaveBalance: 20
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
};

const seedAdmin = async () => {
    const adminEmail = process.env.ADMIN_EMAIL 
    const adminPassword = process.env.ADMIN_PASSWORD 

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
            fullName: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            leaveBalance: 0
        });
        console.log(`Admin seeded: ${adminEmail}`);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    seedAdmin
};
