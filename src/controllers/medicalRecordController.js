const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

// Create a new medical record
exports.createRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    
    // Institutional Automation: Deduct medicine stock from Pharmacy
    if (req.body.prescriptions && req.body.prescriptions.length > 0) {
      const Medicine = require('../models/Medicine');
      for (const item of req.body.prescriptions) {
        if (item.medicine && item.quantity) {
          await Medicine.findOneAndUpdate(
            { name: new RegExp(`^${item.medicine}$`, 'i') }, // Case-insensitive exact match
            { $inc: { stock: -Math.abs(item.quantity) } }
          );
        }
      }
    }

    // Update appointment status to completed if provided
    if (req.body.appointment) {
      await Appointment.findByIdAndUpdate(req.body.appointment, { status: 'Completed' });
    }

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all records for a patient
exports.getPatientRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single record
exports.getRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name age gender')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
