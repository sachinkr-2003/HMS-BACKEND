const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Hospital = require('./src/models/Hospital');
const connectDB = require('./src/config/db');

dotenv.config();

const migrate = async () => {
    try {
        await connectDB();
        console.log("Database connected.");

        // Check if HealthRekha Hospital already exists
        let defaultHospital = await Hospital.findOne({ name: 'HealthRekha Main Hospital' });
        
        if (!defaultHospital) {
            console.log("Creating default HealthRekha Hospital...");
            defaultHospital = await Hospital.create({
                hospitalId: 'HSP-001',
                name: 'HealthRekha Main Hospital',
                location: 'Headquarters',
                adminName: 'HealthRekha Admin',
                adminEmail: 'admin@healthrekha.com',
                plan: 'Enterprise',
                status: 'Active'
            });
            console.log("Created HealthRekha Hospital!");
        } else {
            console.log("HealthRekha Hospital already exists.");
        }

        // Find all non-superadmin users who don't have a hospitalId yet
        const usersToUpdate = await User.find({ 
            role: { $ne: 'superadmin' }, 
            $or: [{ hospitalId: { $exists: false } }, { hospitalId: null }] 
        });

        console.log(`Found ${usersToUpdate.length} legacy users without a hospital ID.`);

        if (usersToUpdate.length > 0) {
            for (let user of usersToUpdate) {
                user.hospitalId = defaultHospital._id;
                await user.save();
                console.log(`Migrated user: ${user.email} (${user.role}) to HealthRekha Hospital.`);
            }
            console.log("Migration Complete!");
        } else {
            console.log("No legacy users needed migration.");
        }

        process.exit();
    } catch (error) {
        console.error("Migration Failed:", error);
        process.exit(1);
    }
};

migrate();
