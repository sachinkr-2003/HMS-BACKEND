const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const LabTest = require('../models/LabTest');
const Bed = require('../models/Bed');

exports.getAdminStats = async (req, res) => {
    try {
        const staffCount = await User.countDocuments({ role: { $ne: 'patient' } });
        const patientCount = await Patient.countDocuments();
        
        const today = new Date();
        today.setHours(0,0,0,0);
        const appointmentsToday = await Appointment.countDocuments({ appointmentDate: { $gte: today } });

        // Advanced Financial Aggregation
        const bills = await Bill.find();
        let totalRevenue = 0;
        let pendingDues = 0;
        let medicationRev = 0;
        let consultationRev = 0;
        let labRev = 0;
        let wardRev = 0;

        bills.forEach(bill => {
            totalRevenue += bill.paidAmount;
            pendingDues += (bill.totalAmount - bill.paidAmount);

            // Heuristic Categorization based on items and appointment link
            const isPharmacy = bill.items.some(i => 
                i.description.toLowerCase().includes('mg') || 
                i.description.toLowerCase().includes('tablet') ||
                i.description.toLowerCase().includes('capsule')
            );
            const isLab = bill.items.some(i => 
                i.description.toLowerCase().includes('test') || 
                i.description.toLowerCase().includes('profile') ||
                i.description.toLowerCase().includes('panel')
            );
            const isConsultation = !!bill.appointment;

            if (isPharmacy) medicationRev += bill.paidAmount;
            else if (isLab) labRev += bill.paidAmount;
            else if (isConsultation) consultationRev += bill.paidAmount;
            else wardRev += bill.paidAmount;
        });

        const totalBeds = await Bed.countDocuments();
        const availableBeds = await Bed.countDocuments({ isAvailable: true });

        res.status(200).json({
            staffCount,
            patientCount,
            appointmentsToday,
            revenue: totalRevenue,
            pendingDues,
            medicationRev,
            consultationRev,
            labRev,
            wardRev,
            gstCollected: totalRevenue * 0.18,
            insuranceClaims: totalRevenue * 0.12,
            totalBeds,
            availableBeds,
            occupancyRate: totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
