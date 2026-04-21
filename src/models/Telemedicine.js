const mongoose = require('mongoose');

const telemedicineSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    consultationDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'], 
        default: 'Scheduled' 
    },
    meetingLink: { type: String },
    notes: { type: String },
    platform: { type: String, default: 'HealthRekha Video' },
}, { timestamps: true });

module.exports = mongoose.model('Telemedicine', telemedicineSchema);
