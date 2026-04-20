const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: true
    },
    testName: {
        type: String,
        required: true
    },
    description: String,
    result: String,
    reportUrl: String,
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LabTest', labTestSchema);
