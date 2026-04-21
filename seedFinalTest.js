const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Purge existing test accounts
        await User.deleteMany({ email: { $in: ['doc@test.com', 'staff@test.com', 'pharm@test.com', 'lab@test.com'] } });
        await Doctor.deleteMany({}); // Purge all doctors as well for a clean test

        // 1. Create Users
        const users = [
            { name: 'Dr. Final Test', email: 'doc@test.com', password: 'password123', role: 'doctor' },
            { name: 'Staff Final', email: 'staff@test.com', password: 'password123', role: 'staff' },
            { name: 'Pharm Final', email: 'pharm@test.com', password: 'password123', role: 'pharmacy' },
            { name: 'Lab Final', email: 'lab@test.com', password: 'password123', role: 'lab' }
        ];

        let testDocUser = null;
        for (let u of users) {
            const user = new User(u);
            const savedUser = await user.save();
            if (u.email === 'doc@test.com') testDocUser = savedUser;
        }

        // 2. Create corresponding Doctor profile
        if (testDocUser) {
            const doctor = new Doctor({
                user: testDocUser._id,
                specialization: 'General Medicine',
                qualification: 'MBBS',
                experience: 10,
                fees: 500,
                status: 'Available'
            });
            await doctor.save();
        }

        console.log('✅ Final Test Ecosystem Provisioned.');
        console.log('Credentials: doc@test.com, staff@test.com, pharm@test.com, lab@test.com (Password: password123)');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
seed();
