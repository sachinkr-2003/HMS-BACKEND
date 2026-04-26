const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Patient = require('./src/models/Patient');
const Bed = require('./src/models/Bed');
const Medicine = require('./src/models/Medicine');
const Asset = require('./src/models/Asset');
const Bill = require('./src/models/Bill');
const Roster = require('./src/models/Roster');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedSystem = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected! Purging old test data...');

        // Clear existing data (Be careful! Only for testing)
        await Promise.all([
            Patient.deleteMany({}),
            Bed.deleteMany({}),
            Medicine.deleteMany({}),
            Asset.deleteMany({}),
            Bill.deleteMany({}),
            Roster.deleteMany({})
        ]);

        // 1. Create Staff Users if not exists
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        let doctor = await User.findOne({ email: 'doctor@test.com' });
        if (!doctor) {
            doctor = await User.create({
                name: 'Dr. Aryan Sharma',
                email: 'doctor@test.com',
                password: hashedPassword,
                role: 'doctor'
            });
        }

        let wardStaff = await User.findOne({ email: 'ward@test.com' });
        if (!wardStaff) {
            wardStaff = await User.create({
                name: 'Nurse Priya',
                email: 'ward@test.com',
                password: hashedPassword,
                role: 'ward'
            });
        }

        console.log('Staff users ready.');

        // 2. Create Patients
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('Error: Admin user not found. Please create admin first.');
            process.exit(1);
        }

        const patients = await Patient.insertMany([
            { name: 'Rahul Khanna', email: 'rahul@gmail.com', contact: '9876543210', gender: 'Male', age: 34, address: 'Lucknow, UP', createdBy: admin._id },
            { name: 'Saira Banu', email: 'saira@gmail.com', contact: '9988776655', gender: 'Female', age: 28, address: 'Delhi, NCR', createdBy: admin._id }
        ]);
        console.log('Patients created.');

        // 3. Create Beds
        const beds = await Bed.insertMany([
            { bedNumber: 'GEN-101', type: 'General', isAvailable: true, ward: 'Ward A' },
            { bedNumber: 'ICU-201', type: 'ICU', isAvailable: false, currentPatient: patients[0]._id, ward: 'Critical Care' },
            { bedNumber: 'SMP-001', type: 'Semi-Private', isAvailable: true, ward: 'Ward B' },
            { bedNumber: 'PVT-301', type: 'Private', isAvailable: true, ward: 'Luxury Ward' }
        ]);
        console.log('Beds provisioned.');

        // 4. Create Medicines
        await Medicine.insertMany([
            { name: 'Amoxicillin 500mg', stock: 150, price: 45, category: 'Antibiotic', expiryDate: '2027-12-31' },
            { name: 'Paracetamol 650mg', stock: 500, price: 15, category: 'Analgesic', expiryDate: '2026-10-15' },
            { name: 'Voglibose 0.3mg', stock: 200, price: 85, category: 'Antidiabetic', expiryDate: '2028-01-20' }
        ]);
        console.log('Medicines stocked.');

        // 5. Create Assets
        await Asset.insertMany([
            { name: 'Ventilator V1', assetCode: 'VEN-001', type: 'Critical Care', status: 'Operational', vendor: 'GlobalHealth' },
            { name: 'X-Ray Machine', assetCode: 'XRAY-99', type: 'Imaging', status: 'Maintenance', vendor: 'Siemens' }
        ]);
        console.log('Assets registered.');

        // 6. Create Bills (to populate dashboard revenue)
        await Bill.insertMany([
            {
                patient: patients[0]._id,
                items: [{ description: 'Consultation Fees', quantity: 1, price: 500 }],
                totalAmount: 500,
                paidAmount: 500,
                status: 'Paid'
            },
            {
                patient: patients[1]._id,
                items: [
                    { description: 'Paracetamol 650mg', quantity: 10, price: 15 },
                    { description: 'Ward Charges', quantity: 2, price: 2000 }
                ],
                totalAmount: 4150,
                paidAmount: 4150,
                status: 'Paid'
            }
        ]);
        console.log('Billing history populated.');

        // 7. Create Roster Shifts
        await Roster.insertMany([
            { personnel: doctor._id, role: 'doctor', department: 'OPD', shift: 'Morning', date: new Date(), status: 'On-Duty' },
            { personnel: wardStaff._id, role: 'ward', department: 'ICU', shift: 'Night', date: new Date(), status: 'Scheduled' }
        ]);
        console.log('Duty roster synchronized.');

        console.log('\n--- SYSTEM SEEDED SUCCESSFULLY ---');
        console.log('Use doctor@test.com / admin123 to test Doctor login');
        console.log('Use ward@test.com / admin123 to test Ward Staff login');
        
        process.exit();
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seedSystem();
