const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./src/models/Appointment');
const User = require('./src/models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find an admin and a doctor
        const admin = await User.findOne({ role: 'admin' });
        const doctor = await User.findOne({ role: 'doctor' });

        if (!admin || !doctor) {
            console.log('Need at least one admin and one doctor in DB first');
            process.exit();
        }

        const appts = [
            {
                patient: admin._id, // Just for test
                doctor: doctor._id,
                appointmentDate: new Date(),
                reason: 'Routine Checkup',
                status: 'Confirmed'
            },
            {
                patient: admin._id,
                doctor: doctor._id,
                appointmentDate: new Date(Date.now() + 86400000),
                reason: 'Follow up',
                status: 'Pending'
            }
        ];

        await Appointment.insertMany(appts);
        console.log('Appointments seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
