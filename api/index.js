const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../server_lib/config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { seedAdmin } = require('../server_lib/controllers/authController');
seedAdmin();

app.use('/api/auth', require('../server_lib/routes/authRoutes'));
app.use('/api/leaves', require('../server_lib/routes/leaveRoutes'));
app.use('/api/attendance', require('../server_lib/routes/attendanceRoutes'));
app.use('/api/reports', require('../server_lib/routes/reportRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
