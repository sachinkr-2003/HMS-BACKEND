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

        // Add 50 random bills to make it look busy
        const bills = [];
        for(let i=0; i<50; i++) {
            const amount = Math.floor(Math.random() * 5000) + 500;
            bills.push({
                patient: admin._id,
                items: [{ description: 'Hospital Service', amount }],
                totalAmount: amount,
                status: Math.random() > 0.3 ? 'Paid' : 'Unpaid',
                paymentMethod: 'UPI',
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
            });
        }

        await Bill.insertMany(bills);
        console.log('50 Busy Bills seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
