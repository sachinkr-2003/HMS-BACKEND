const Bill = require('../models/Bill');

// @desc    Create a new bill
// @route   POST /api/billing
// @access  Private
exports.createBill = async (req, res) => {
    try {
        const bill = await Bill.create(req.body);
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bills
// @route   GET /api/billing
// @access  Private
exports.getBills = async (req, res) => {
    try {
        const bills = await Bill.find().populate('patient', 'name');
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single bill
// @route   GET /api/billing/:id
// @access  Private
exports.getBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('patient', 'name');
        if (!bill) return res.status(404).json({ message: 'Bill not found' });
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update bill status (Paid)
// @route   PUT /api/billing/:id/pay
// @access  Private
exports.payBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(
            req.params.id, 
            { status: 'Paid', paymentMethod: req.body.paymentMethod }, 
            { new: true }
        );
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
