const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const notificationService = require('../../services/notificationService');

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, reason } = req.body;

        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            reason
        });

        // Send SMS Notification
        const patient = await Patient.findById(patientId);
        if (patient && patient.phone) {
            const msg = `Hello ${patient.name}, your appointment at HealthRekha Hospital is booked for ${new Date(appointmentDate).toLocaleString()}. Reason: ${reason}.`;
            await notificationService.sendSMS(patient.phone, msg);
        }

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin/Staff)
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name' }
            });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Admin/Doctor)
exports.updateStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate('patient');

        // Notify patient of status change
        if (appointment && appointment.patient && appointment.patient.phone) {
            const msg = `Update from HealthRekha: Your appointment status is now ${req.body.status.toUpperCase()}.`;
            await notificationService.sendSMS(appointment.patient.phone, msg);
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get appointments by doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private
exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId })
            .populate('patient', 'name');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get appointments by date
// @route   GET /api/appointments/date/:date
// @access  Private
exports.getAppointmentsByDate = async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const start = new Date(date.setHours(0,0,0,0));
        const end = new Date(date.setHours(23,59,59,999));

        const appointments = await Appointment.find({
            appointmentDate: { $gte: start, $lte: end }
        }).populate('patient', 'name');
        
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
