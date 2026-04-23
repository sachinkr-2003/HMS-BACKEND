const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./src/models/Medicine');
const LabTest = require('./src/models/LabTest');
const User = require('./src/models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) process.exit();

        // 1. Seed Medicines
        await Medicine.deleteMany({});
        const meds = [
            { name: 'Amoxicillin 500mg', stock: 120, price: 45, category: 'Antibiotic', expiryDate: '2027-12-31' },
            { name: 'Paracetamol 650mg', stock: 450, price: 15, category: 'Analgesic', expiryDate: '2026-10-15' },
            { name: 'Metformin 850mg', stock: 200, price: 12, category: 'Antidiabetic', expiryDate: '2028-01-20' },
            { name: 'Atorvastatin 20mg', stock: 80, price: 35, category: 'Statin', expiryDate: '2027-05-10' },
            { name: 'Lisinopril 10mg', stock: 150, price: 18, category: 'ACE Inhibitor', expiryDate: '2026-08-25' },
        ];
        await Medicine.insertMany(meds);
        console.log('Medicines seeded!');

        // 2. Seed Lab Tests
        const labCount = await LabTest.countDocuments();
        if (labCount === 0) {
            const labs = [
                { patient: admin._id, testName: 'CBC Profile', status: 'Pending' },
                { patient: admin._id, testName: 'Lipid Panel', status: 'Completed', result: 'Cholesterol levels slightly high (210mg/dL).' },
                { patient: admin._id, testName: 'Thyroid T3/T4', status: 'Pending' },
                { patient: admin._id, testName: 'Kidney Function Test', status: 'Pending' },
            ];
            await LabTest.insertMany(labs);
            console.log('Lab Tests seeded!');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
