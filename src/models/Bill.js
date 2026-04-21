const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: true
    },
    appointment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Appointment'
    },
    items: [{
        description: String,
        amount: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Pending', 'Partially Paid'],
        default: 'Unpaid'
    },
    paymentMethod: String,
    insurance: {
        provider: String,
        policyNumber: String,
        claimStatus: {
            type: String,
            enum: ['Not Filed', 'Filed', 'Approved', 'Rejected'],
            default: 'Not Filed'
        },
        coveredAmount: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bill', billSchema);
