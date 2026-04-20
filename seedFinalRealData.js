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
        const medicineCount = await Medicine.countDocuments();
        if (medicineCount === 0) {
            const meds = [
                { name: 'Amoxicillin 500mg', stock: 120, price: 45, category: 'Antibiotic' },
                { name: 'Paracetamol 650mg', stock: 450, price: 2, category: 'Analgesic' },
                { name: 'Metformin 850mg', stock: 200, price: 12, category: 'Antidiabetic' },
                { name: 'Atorvastatin 20mg', stock: 80, price: 35, category: 'Statin' },
                { name: 'Lisinopril 10mg', stock: 150, price: 8, category: 'ACE Inhibitor' },
            ];
            await Medicine.insertMany(meds);
            console.log('Medicines seeded!');
        }

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
