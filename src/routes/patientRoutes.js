const express = require('express');
const { addPatient, getPatients, getPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getPatients)
    .post(protect, authorize('admin', 'doctor'), addPatient);

router.route('/:id')
    .get(protect, getPatient)
    .put(protect, authorize('admin', 'doctor'), updatePatient)
    .delete(protect, authorize('admin'), deletePatient);

module.exports = router;
