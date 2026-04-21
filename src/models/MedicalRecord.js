const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  symptoms: [String],
  diagnosis: String,
  vitalSigns: {
    bloodPressure: String,
    temperature: String,
    pulse: String,
    weight: String
  },
  clinicalNotes: String,
  prescriptions: [{
    medicine: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: Number,
    price: Number,
    notes: String
  }],
  attachments: [String], // URLs to reports or images
  followUpDate: Date
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
