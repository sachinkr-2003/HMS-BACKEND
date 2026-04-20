const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bill = require('./src/models/Bill');
const User = require('./src/models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) process.exit();

        const count = await Bill.countDocuments();
        if (count > 0) process.exit();

        const bills = [
            {
                patient: admin._id,
                items: [{ description: 'Emergency Consultation', amount: 1200 }],
                totalAmount: 1200,
                status: 'Paid',
                paymentMethod: 'UPI'
            },
            {
                patient: admin._id,
                items: [{ description: 'MRI Scan', amount: 8500 }],
                totalAmount: 8500,
                status: 'Paid',
                paymentMethod: 'Card'
            },
            {
                patient: admin._id,
                items: [{ description: 'Lab Test - CBC', amount: 450 }],
                totalAmount: 450,
                status: 'Unpaid'
            }
        ];

        await Bill.insertMany(bills);
        console.log('Bills seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
