const Bill = require('../models/Bill');

// @desc    Create a new bill
// @route   POST /api/billing
// @access  Private
exports.createBill = async (req, res) => {
    try {
        const bill = await Bill.create(req.body);
        
        // Institutional Automation: Deduct stock if items match medicines
        if (req.body.items && req.body.items.length > 0) {
            const Medicine = require('../models/Medicine');
            for (const item of req.body.items) {
                if (item.description) {
                    await Medicine.findOneAndUpdate(
                        { name: new RegExp(`^${item.description}$`, 'i') },
                        { $inc: { stock: -Math.abs(item.quantity || 1) } }
                    );
                }
            }
        }

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
        if (!bill) return res.status(404).json({ message: 'Bill not found' });
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Download Bill Invoice as PDF
// @route   GET /api/billing/:id/download
// @access  Private
exports.downloadInvoice = async (req, res) => {
    console.log(`Generating invoice for ID: ${req.params.id}`);
    try {
        const path = require('path');
        const { generateInvoicePDF } = require('../utils/generatePDF');
        const Bill = require('../models/Bill');
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
