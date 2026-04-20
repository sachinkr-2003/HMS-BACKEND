const Bed = require('../models/Bed');

// @desc    Add bed
// @route   POST /api/beds
// @access  Private (Admin)
exports.addBed = async (req, res) => {
    try {
        const bed = await Bed.create(req.body);
        res.status(201).json(bed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all beds
// @route   GET /api/beds
// @access  Public
exports.getBeds = async (req, res) => {
    try {
        const beds = await Bed.find().populate('currentPatient', 'name');
        res.status(200).json(beds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign bed
// @route   PUT /api/beds/:id/assign
// @access  Private
exports.assignBed = async (req, res) => {
    try {
        const bed = await Bed.findById(req.params.id);
        if (!bed) return res.status(404).json({ message: 'Bed not found' });
        
        bed.currentPatient = req.body.patientId;
        bed.isAvailable = false;
        await bed.save();
        
        res.status(200).json(bed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Discharge/Free bed
// @route   PUT /api/beds/:id/discharge
// @access  Private
exports.dischargeBed = async (req, res) => {
    try {
        const bed = await Bed.findById(req.params.id);
        if (!bed) return res.status(404).json({ message: 'Bed not found' });
        
        bed.currentPatient = null;
        bed.isAvailable = true;
        await bed.save();
        
        res.status(200).json(bed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
