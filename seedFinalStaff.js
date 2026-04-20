const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedRest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const extraStaff = [
            {
                name: 'Ward Manager',
                email: 'ward@hms.com',
                password: 'ward123',
                role: 'admin' // Ward management is typically an admin or head nurse role
            },
            {
                name: 'Patient John Doe',
                email: 'patient@hms.com',
                password: 'patient123',
                role: 'patient'
            }
        ];

        for (const staff of extraStaff) {
            const exists = await User.findOne({ email: staff.email });
            if (!exists) {
                await User.create(staff);
                console.log(`Created ${staff.role}: ${staff.email}`);
            }
        }

        console.log('Final Institutional Seed Complete!');
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seedRest();
