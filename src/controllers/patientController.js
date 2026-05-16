const Patient = require('../models/Patient');

// @desc    Add new patient
// @route   POST /api/patients
// @access  Private (Admin/Staff)
exports.addPatient = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const patient = await Patient.create(req.body);
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res) => {
    try {
        let patients = await Patient.find().populate('createdBy', 'name hospitalId');
        if (req.user && req.user.role !== 'superadmin') {
            patients = patients.filter(p => p.createdBy && p.createdBy.hospitalId && p.createdBy.hospitalId.toString() === req.user.hospitalId.toString());
        }
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json({ message: 'Patient removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
