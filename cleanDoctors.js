const mongoose = require('mongoose');
const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');
require('dotenv').config();

const clean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Cleanup...");

        // 1. Remove all Doctor profiles
        await Doctor.deleteMany({});
        
        // 2. Remove all Doctor users except one (or keep none and let user add)
        // Let's keep the user 'sachin@hms.com' if it exists, otherwise remove all.
        await User.deleteMany({ role: 'doctor' });
        
        console.log("All doctors purged. Database is now clean.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clean();
