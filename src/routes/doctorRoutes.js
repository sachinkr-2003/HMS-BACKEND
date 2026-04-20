const express = require('express');
const { 
    createDoctorProfile, 
    getDoctors, 
    getDoctor, 
    updateDoctorProfile, 
    updateAvailability,
    getMyProfile
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getDoctors)
    .post(protect, authorize('admin'), createDoctorProfile);

router.get('/me', protect, authorize('doctor'), getMyProfile);

router.route('/:id')
    .get(getDoctor)
    .put(protect, authorize('admin', 'doctor'), updateDoctorProfile);

router.put('/:id/availability', protect, authorize('doctor'), updateAvailability);

module.exports = router;
