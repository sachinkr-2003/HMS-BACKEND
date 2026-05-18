const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin-stats', protect, authorize('admin', 'superadmin', 'ward'), getAdminStats);

module.exports = router;
