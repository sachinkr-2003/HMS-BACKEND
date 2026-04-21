const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./src/models/Appointment');
const Bed = require('./src/models/Bed');
const Bill = require('./src/models/Bill');
const Doctor = require('./src/models/Doctor');
const LabTest = require('./src/models/LabTest');
const Medicine = require('./src/models/Medicine');
const Patient = require('./src/models/Patient');
const User = require('./src/models/User');

dotenv.config();

const purgeAllData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Operational Protocol: Purging Institutional Data...');

        // Clear all operational collections
        await Appointment.deleteMany({});
        await Bed.deleteMany({});
        await Bill.deleteMany({});
        await Doctor.deleteMany({});
        await LabTest.deleteMany({});
        await Medicine.deleteMany({});
        await Patient.deleteMany({});
        
        // Clear all users EXCEPT the primary administrator
        await User.deleteMany({ email: { $ne: 'admin@hms.com' } });

        console.log('✅ Institutional Zero-State Achieved.');
        console.log('Remaining User: admin@hms.com (Password: admin123)');
        process.exit();
    } catch (error) {
        console.error('Purge Failed:', error.message);
        process.exit(1);
    }
};

purgeAllData();
