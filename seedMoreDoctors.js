const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedMore = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const extraDoctors = [
            {
                name: 'Dr. Neha Gupta',
                email: 'neha@hms.com',
                password: 'password123',
                role: 'doctor'
            },
            {
                name: 'Dr. Rahul Varma',
                email: 'rahul@hms.com',
                password: 'password123',
                role: 'doctor'
            },
            {
                name: 'Dr. S. K. Singh',
                email: 'singh@hms.com',
                password: 'password123',
                role: 'doctor'
            }
        ];

        for (const doc of extraDoctors) {
            const exists = await User.findOne({ email: doc.email });
            if (!exists) {
                await User.create(doc);
                console.log(`Created Doctor: ${doc.name}`);
            }
        }

        console.log('Extra Institutional Staff Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seedMore();
