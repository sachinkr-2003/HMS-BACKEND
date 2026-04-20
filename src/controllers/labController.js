const LabTest = require('../models/LabTest');

// @desc    Create new lab test
// @route   POST /api/lab
// @access  Private
exports.createLabTest = async (req, res) => {
    try {
        const labTest = await LabTest.create(req.body);
        res.status(201).json(labTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all lab tests
// @route   GET /api/lab
// @access  Private
exports.getLabTests = async (req, res) => {
    try {
        const tests = await LabTest.find().populate('patient', 'name');
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lab test result
// @route   PUT /api/lab/:id
// @access  Private (Lab Tech)
exports.updateLabResult = async (req, res) => {
    try {
        const test = await LabTest.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, status: 'Completed' }, 
            { new: true }
        );
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
