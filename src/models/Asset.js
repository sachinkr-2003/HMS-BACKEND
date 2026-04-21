const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    assetCode: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // e.g., Imaging, Critical Care
    status: { 
        type: String, 
        enum: ['Operational', 'Maintenance', 'Low Battery', 'Repair Required'], 
        default: 'Operational' 
    },
    lastService: { type: Date, default: Date.now },
    nextService: { type: Date },
    vendor: { type: String },
    location: { type: String }, // Department/Ward
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
