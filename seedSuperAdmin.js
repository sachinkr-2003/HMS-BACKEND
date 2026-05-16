require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User'); // Adjust path if needed

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hospital:hospital123@cluster0.zox7b.mongodb.net/hms?retryWrites=true&w=majority').then(async () => {
    console.log("Connected to DB");
    
    // Check if superadmin exists
    let superadmin = await User.findOne({ role: 'superadmin' });
    
    if (superadmin) {
        console.log("Super Admin already exists: superadmin@healthrekha.com");
    } else {
        superadmin = new User({
            name: "System Owner",
            email: "superadmin@healthrekha.com",
            password: "password123", // Will be hashed by pre-save hook
            role: "superadmin"
        });
        await superadmin.save();
        console.log("Super Admin created successfully!");
        console.log("Email: superadmin@healthrekha.com");
        console.log("Password: password123");
    }
    
    mongoose.disconnect();
}).catch(err => console.log(err));
