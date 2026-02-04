const express = require('express');
const router = express.Router();
const { getMonthlyReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/monthly', protect, admin, getMonthlyReport);

module.exports = router;
