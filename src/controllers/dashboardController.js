const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const LabTest = require('../models/LabTest');
const Bed = require('../models/Bed');

exports.getAdminStats = async (req, res) => {
    try {
        const hid = req.user.role !== 'superadmin' ? req.user.hospitalId : null;
        const userFilter = hid ? { hospitalId: hid, role: { $ne: 'patient' } } : { role: { $ne: 'patient' } };

        const staffCount = await User.countDocuments(userFilter);
        const patientCount = await Patient.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentsToday = await Appointment.countDocuments({ appointmentDate: { $gte: today } });

        const bills = await Bill.find();
        let totalRevenue = 0, pendingDues = 0, medicationRev = 0, consultationRev = 0, labRev = 0, wardRev = 0;

        bills.forEach(bill => {
            totalRevenue += bill.paidAmount || 0;
            pendingDues += ((bill.totalAmount || 0) - (bill.paidAmount || 0));
            const isPharmacy = bill.items.some(i => i.description && (
                i.description.toLowerCase().includes('mg') ||
                i.description.toLowerCase().includes('tablet') ||
                i.description.toLowerCase().includes('capsule')
            ));
            const isLab = bill.items.some(i => i.description && (
                i.description.toLowerCase().includes('test') ||
                i.description.toLowerCase().includes('profile') ||
                i.description.toLowerCase().includes('panel')
            ));
            if (isPharmacy) medicationRev += bill.paidAmount || 0;
            else if (isLab) labRev += bill.paidAmount || 0;
            else if (bill.appointment) consultationRev += bill.paidAmount || 0;
            else wardRev += bill.paidAmount || 0;
        });

        const totalBeds = await Bed.countDocuments();
        const availableBeds = await Bed.countDocuments({ isAvailable: true });
        const medicineCount = await Medicine.countDocuments();
        const pendingLabs = await LabTest.countDocuments({ status: 'Pending' });

        res.status(200).json({
            staffCount, patientCount, appointmentsToday,
            revenue: totalRevenue, pendingDues,
            medicationRev, consultationRev, labRev, wardRev,
            gstCollected: totalRevenue * 0.18,
            insuranceClaims: totalRevenue * 0.12,
            totalBeds, availableBeds, medicineCount, pendingLabs,
            occupancyRate: totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
