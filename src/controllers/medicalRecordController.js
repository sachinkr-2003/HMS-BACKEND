const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

// Create a new medical record
exports.createRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    
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
      .populate('doctor', 'name specialization')
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
      .populate('doctor', 'name specialization');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
