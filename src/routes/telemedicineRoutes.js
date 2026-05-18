const express = require('express');
const router = express.Router();
const { getConsultations, scheduleConsultation } = require('../controllers/telemedicineController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getConsultations);
router.post('/schedule', protect, scheduleConsultation);

module.exports = router;
