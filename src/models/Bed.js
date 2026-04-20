const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
    bedNumber: {
        type: String,
        required: true,
        unique: true
    },
    ward: String,
    type: {
        type: String,
        enum: ['General', 'Semi-Private', 'Private', 'ICU'],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentPatient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
    }
});

module.exports = mongoose.model('Bed', bedSchema);
