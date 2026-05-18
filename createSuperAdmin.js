const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'superadmin@healthrekha.com';
        const exists = await User.findOne({ email });
        
        if (exists) {
            console.log('Super Admin already exists. Updating password...');
            exists.password = 'superpassword123';
            await exists.save();
            console.log('Password updated successfully!');
            console.log('Email:', email);
            console.log('Password: superpassword123');
            process.exit(0);
        }

        const user = await User.create({
            name: 'Super Admin',
            email: email,
            password: 'superpassword123',
            role: 'superadmin'
        });

        console.log('Super Admin created successfully!');
        console.log('Email:', user.email);
        console.log('Password: superpassword123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating/updating super admin:', error);
        process.exit(1);
    }
};

createSuperAdmin();
