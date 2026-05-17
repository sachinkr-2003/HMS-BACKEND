const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    age: {
        type: Number,
        required: [true, 'Please add age']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other'],
        required: [true, 'Please add gender'],
        set: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v
    },
    contact: {
        type: String,
        required: [true, 'Please add contact number']
    },
    address: String,
    bloodGroup: String,
    medicalHistory: [{
        diagnosis: String,
        treatment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', patientSchema);
