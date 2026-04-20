const express = require('express');
const { 
    bookAppointment, 
    getAppointments, 
    updateStatus, 
    getDoctorAppointments, 
    getAppointmentsByDate 
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getAppointments)
    .post(protect, bookAppointment);

router.put('/:id/status', protect, authorize('admin', 'doctor'), updateStatus);
router.get('/doctor/:doctorId', protect, getDoctorAppointments);
router.get('/date/:date', protect, getAppointmentsByDate);

module.exports = router;
