const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./src/models/Medicine');
dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Medicine.countDocuments();
        console.log('Medicine Count:', count);
        const meds = await Medicine.find().limit(5);
        console.log('Medicines:', JSON.stringify(meds, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
