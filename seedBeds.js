const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bed = require('./src/models/Bed');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const count = await Bed.countDocuments();
        if (count > 0) process.exit();

        const beds = [
            { bedNumber: 'W-101', type: 'General', isAvailable: true },
            { bedNumber: 'W-102', type: 'General', isAvailable: true },
            { bedNumber: 'I-201', type: 'ICU', isAvailable: true },
            { bedNumber: 'I-202', type: 'ICU', isAvailable: true },
            { bedNumber: 'P-301', type: 'Private', isAvailable: true },
        ];

        await Bed.insertMany(beds);
        console.log('Beds seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
