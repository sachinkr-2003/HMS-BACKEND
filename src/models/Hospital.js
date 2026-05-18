const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospitalId: { type: String, required: true, unique: true }, // e.g., HSP-001
    name: { type: String, required: true },
    location: { type: String, required: true },
    upiId: { type: String }, // UPI ID for QR code generation
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['Basic', 'Professional', 'Enterprise'], default: 'Basic' },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
