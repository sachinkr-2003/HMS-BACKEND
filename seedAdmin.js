const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminExists = await User.findOne({ email: 'admin@hms.com' });
        if (adminExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        const admin = await User.create({
            name: 'Hospital Administrator',
            email: 'admin@hms.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin created successfully!');
        console.log('Email: admin@hms.com');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
