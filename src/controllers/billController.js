const Bill = require('../models/Bill');
const { generateInvoicePDF } = require('../utils/generatePDF');
const path = require('path');
const fs = require('fs');

// @desc    Create bill
// @route   POST /api/billing
// @access  Private (Admin/Staff)
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

// @desc    Get bill by ID
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

// @desc    Update payment status
// @route   PUT /api/billing/:id/status
// @access  Private (Admin)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, paymentMethod: req.body.paymentMethod },
            { new: true }
        );
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download Bill Invoice as PDF
// @route   GET /api/billing/:id/download
// @access  Private
exports.downloadInvoice = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('patient', 'name');
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        const fileName = `invoice_${bill._id}.pdf`;
        const filePath = path.join(__dirname, '../../uploads/invoices', fileName);

        await generateInvoicePDF(bill, filePath);

        res.download(filePath, fileName, (err) => {
            if (err) {
                if (!res.headersSent) {
                    res.status(500).json({ message: "Could not download file" });
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
