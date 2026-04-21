const mongoose = require('mongoose');

const rosterSchema = new mongoose.Schema({
    personnel: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    shift: { 
        type: String, 
        enum: ['Morning', 'Evening', 'Night', 'General'], 
        required: true 
    },
    date: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['On-Duty', 'Scheduled', 'Rest', 'On-Leave'], 
        default: 'Scheduled' 
    },
    startTime: { type: String }, // e.g., "08:00"
    endTime: { type: String },   // e.g., "16:00"
}, { timestamps: true });

module.exports = mongoose.model('Roster', rosterSchema);
