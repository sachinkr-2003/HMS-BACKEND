const mongoose = require('mongoose');
const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');
require('dotenv').config();

const fixDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Doctor Sync...");

        const doctors = await User.find({ role: 'doctor' });
        console.log(`Found ${doctors.length} doctor users.`);

        for (const user of doctors) {
            const profile = await Doctor.findOne({ user: user._id });
            if (!profile) {
                console.log(`Creating profile for: ${user.name}`);
                await Doctor.create({
                    user: user._id,
                    specialization: 'General Physician',
                    fees: 500,
                    availability: [
                        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Friday', startTime: '09:00', endTime: '17:00' }
                    ]
                });
            } else {
                console.log(`Profile already exists for: ${user.name}`);
            }
        }

        console.log("Doctor Sync Complete!");
        process.exit(0);
    } catch (err) {
        console.error("Sync Error:", err);
        process.exit(1);
    }
};

fixDoctors();
