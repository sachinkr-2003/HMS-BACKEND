const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User'); // Check paths
// Add all other models

dotenv.config();

const purgeInstitutionalData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- INSTITUTIONAL DATA PURGE INITIATED ---');

        // Note: In a real system, we would list all collections
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            if (key === 'users') {
                // Keep only the Super Admin
                await collections[key].deleteMany({ role: { $ne: 'admin' } });
                console.log('User Registry refined: Non-admin entries purged.');
            } else {
                await collections[key].deleteMany({});
                console.log(`Collection Purged: ${key}`);
            }
        }

        console.log('--- PURGE SUCCESSFUL: TERMINAL READY FOR REAL DATA ---');
        process.exit(0);
    } catch (err) {
        console.error('Purge Critical Failure:', err);
        process.exit(1);
    }
};

// Verification safety check
console.warn('WARNING: This will delete ALL non-admin data. Running in 5s...');
setTimeout(purgeInstitutionalData, 5000);
