const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add medicine name']
    },
    manufacturer: String,
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    expiryDate: Date,
    category: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Medicine', medicineSchema);
