const express = require('express');
const router = express.Router();
const { getConsultations, scheduleConsultation } = require('../controllers/telemedicineController');

router.get('/', getConsultations);
router.post('/schedule', scheduleConsultation);

module.exports = router;
