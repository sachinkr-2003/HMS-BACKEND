const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const doctorExists = await User.findOne({ email: 'doctor@hms.com' });
        if (doctorExists) {
            process.exit();
        }

        await User.create({
            name: 'Dr. Sameer Khan',
            email: 'doctor@hms.com',
            password: 'doctor123',
            role: 'doctor'
        });

        console.log('Doctor created!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
