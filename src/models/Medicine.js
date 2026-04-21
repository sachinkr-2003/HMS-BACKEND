const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add medicine name']
    },
    manufacturer: String,
    batchNumber: String,
    stock: {
        type: Number,
        default: 0
    },
    minStockLevel: {
        type: Number,
        default: 10
    },
    price: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    category: String,
    supplier: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Medicine', medicineSchema);
