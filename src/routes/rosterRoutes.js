const express = require('express');
const router = express.Router();
const { getRoster, assignShift } = require('../controllers/rosterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getRoster);
router.post('/assign', protect, authorize('admin', 'ward', 'staff'), assignShift);

module.exports = router;
