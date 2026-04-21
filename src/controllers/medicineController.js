const Medicine = require('../models/Medicine');

// @desc    Add medicine
// @route   POST /api/pharmacy
// @access  Private (Admin/Pharmacy)
exports.addMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);
        res.status(201).json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all medicines
// @route   GET /api/pharmacy
// @access  Public
exports.getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update stock
// @route   PUT /api/pharmacy/:id/stock
// @access  Private
exports.updateStock = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        
        medicine.stock = req.body.stock;
        await medicine.save();
        
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check expiry
// @route   GET /api/pharmacy/expiry
// @access  Private
exports.checkExpiry = async (req, res) => {
    try {
        const today = new Date();
        const expiringSoon = await Medicine.find({
            expiryDate: { $lte: new Date(today.setMonth(today.getMonth() + 3)) }
        });
        res.status(200).json(expiringSoon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check Low Stock
// @route   GET /api/pharmacy/low-stock
// @access  Private
exports.getLowStock = async (req, res) => {
    try {
        const lowStock = await Medicine.find({ stock: { $lte: 10 } });
        res.status(200).json(lowStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Delete medicine
// @route   DELETE /api/pharmacy/:id
// @access  Private
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ message: 'Medicine unit not found' });
        
        await medicine.deleteOne();
        res.status(200).json({ message: 'Medicine unit decommissioned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
