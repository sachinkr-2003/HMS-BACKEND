const Patient = require('../models/Patient');

// @desc    Add new patient
// @route   POST /api/patients
// @access  Private (Admin/Staff)
exports.addPatient = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        
        // Ensure user has a hospitalId
        if (!req.user.hospitalId) {
            return res.status(400).json({ message: 'Your account is not associated with any hospital. Please contact Admin.' });
        }
        
        req.body.hospitalId = req.user.hospitalId;
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
        let query = {};
        if (req.user && req.user.role !== 'superadmin') {
            query.hospitalId = req.user.hospitalId;
        }
        const patients = await Patient.find(query).populate('createdBy', 'name hospitalId');
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
        let query = { _id: req.params.id };
        if (req.user && req.user.role !== 'superadmin') {
            query.hospitalId = req.user.hospitalId;
        }
        const patient = await Patient.findOne(query);
        if (!patient) return res.status(404).json({ message: 'Patient not found or unauthorized' });
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
        let query = { _id: req.params.id };
        if (req.user && req.user.role !== 'superadmin') {
            query.hospitalId = req.user.hospitalId;
        }
        const patient = await Patient.findOneAndUpdate(query, req.body, { new: true });
        if (!patient) return res.status(404).json({ message: 'Patient not found or unauthorized' });
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
        let query = { _id: req.params.id };
        if (req.user && req.user.role !== 'superadmin') {
            query.hospitalId = req.user.hospitalId;
        }
        const patient = await Patient.findOneAndDelete(query);
        if (!patient) return res.status(404).json({ message: 'Patient not found or unauthorized' });
        res.status(200).json({ message: 'Patient removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
