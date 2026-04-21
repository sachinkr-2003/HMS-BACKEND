const express = require('express');
const router = express.Router();
const { createRecord, getPatientRecords, getRecord } = require('../controllers/medicalRecordController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createRecord);
router.get('/patient/:patientId', getPatientRecords);
router.get('/:id', getRecord);

module.exports = router;
