const Doctor = require('../models/Doctor');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private (Admin)
exports.createDoctorProfile = async (req, res) => {
    try {
        const { userId, specialization, fees, availability } = req.body;
        
        // Check if user exists and is a doctor
        const user = await User.findById(userId);
        if (!user || user.role !== 'doctor') {
            return res.status(400).json({ message: 'Valid doctor user ID is required' });
        }

        const doctor = await Doctor.create({
            user: userId,
            hospitalId: user.hospitalId,
            specialization,
            fees,
            availability
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
    try {
        let query = {};
        
        let reqHospitalId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const requestingUser = await User.findById(decoded.id);
                if (requestingUser && requestingUser.role !== 'superadmin') {
                    reqHospitalId = requestingUser.hospitalId;
                }
            } catch (err) {}
        }
        
        if (reqHospitalId) {
            query.hospitalId = reqHospitalId;
        }
        
        const doctors = await Doctor.find(query).populate('user', 'name email hospitalId');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Admin/Doctor)
exports.updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update availability
// @route   PUT /api/doctors/:id/availability
// @access  Private (Doctor)
exports.updateAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        
        doctor.availability = req.body.availability;
        await doctor.save();
        
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get current doctor profile
// @route   GET /api/doctors/me
// @access  Private (Doctor)
exports.getMyProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not initialized' });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
