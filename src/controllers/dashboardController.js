const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const LabTest = require('../models/LabTest');
const Bed = require('../models/Bed');

exports.getAdminStats = async (req, res) => {
    try {
        // Basic Counts
        const staffCount = await User.countDocuments({ role: { $ne: 'patient' } });
        const patientCount = await Patient.countDocuments();
        
        // Appointments
        const today = new Date();
        today.setHours(0,0,0,0);
        const appointmentsToday = await Appointment.countDocuments({
            appointmentDate: { $gte: today }
        });

        // Revenue Aggregation
        const billingStats = await Bill.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { 
                        $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$totalAmount", 0] } 
                    },
                    pendingDues: { 
                        $sum: { $cond: [{ $ne: ["$status", "Paid"] }, "$totalAmount", 0] } 
                    }
                }
            }
        ]);
        const bStats = billingStats[0] || { totalRevenue: 0, pendingDues: 0 };

        // Medicine Stats
        const medicineCount = await Medicine.countDocuments();
        
        // Lab Stats
        const pendingLabs = await LabTest.countDocuments({ status: 'Pending' });

        // Bed Stats
        const totalBeds = await Bed.countDocuments();
        const availableBeds = await Bed.countDocuments({ isAvailable: true });

        res.status(200).json({
            staffCount,
            patientCount,
            appointmentsToday,
            revenue: bStats.totalRevenue,
            pendingDues: bStats.pendingDues,
            medicineCount,
            pendingLabs,
            totalBeds,
            availableBeds,
            occupancyRate: totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
