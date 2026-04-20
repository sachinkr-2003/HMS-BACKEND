const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

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
        );
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
