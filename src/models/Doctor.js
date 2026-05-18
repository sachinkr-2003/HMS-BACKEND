const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hospital',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: [true, 'Please add specialization']
    },
    qualification: String,
    experience: {
        type: Number,
        default: 0
    },
    fees: {
        type: Number,
        required: [true, 'Please add consultation fees']
    },
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String, // e.g. "09:00"
        endTime: String    // e.g. "17:00"
    }],
    status: {
        type: String,
        enum: ['Available', 'On Leave', 'Busy'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
