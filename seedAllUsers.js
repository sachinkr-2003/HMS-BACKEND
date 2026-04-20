const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database for Seeding...');

        const usersData = [
            { name: 'Hospital Admin', email: 'admin@hms.com', password: 'admin123', role: 'admin' },
            { name: 'Dr. Sameer Khan', email: 'doctor@hms.com', password: 'doctor123', role: 'doctor' },
            { name: 'Rahul Sharma (Patient)', email: 'patient@hms.com', password: 'patient123', role: 'patient' },
            { name: 'Chief Pharmacist', email: 'pharmacy@hms.com', password: 'pharmacy123', role: 'pharmacy' },
            { name: 'Lab Director', email: 'lab@hms.com', password: 'lab123', role: 'lab' },
            { name: 'Ward Supervison', email: 'ward@hms.com', password: 'ward123', role: 'ward' },
            { name: 'Accounts Head', email: 'billing@hms.com', password: 'billing123', role: 'billing' }
        ];

        for (const u of usersData) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Created ${u.role}: ${u.email}`);
            } else {
                console.log(`${u.role} already exists: ${u.email}`);
            }
        }

        console.log('Master Seeding Completed Successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding users:', err);
        process.exit(1);
    }
};

seedUsers();
