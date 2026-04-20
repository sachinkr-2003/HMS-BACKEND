const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedStaff = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const staffDocs = [
            {
                name: 'Main Administrator',
                email: 'admin@hms.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'Dr. Aryan Sharma',
                email: 'doctor@hms.com',
                password: 'doc123',
                role: 'doctor'
            },
            {
                name: 'Pharmacy Manager',
                email: 'pharmacy@hms.com',
                password: 'pharma123',
                role: 'pharmacy'
            },
            {
                name: 'Lab Technician',
                email: 'lab@hms.com',
                password: 'lab123',
                role: 'lab'
            },
            {
                name: 'Billing Officer',
                email: 'billing@hms.com',
                password: 'bill123',
                role: 'billing'
            }
        ];

        for (const staff of staffDocs) {
            const exists = await User.findOne({ email: staff.email });
            if (!exists) {
                await User.create(staff);
                console.log(`Created ${staff.role}: ${staff.email}`);
            } else {
                console.log(`${staff.role} already exists: ${staff.email}`);
            }
        }

        console.log('Institutional Staff Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding staff:', error.message);
        process.exit(1);
    }
};

seedStaff();
