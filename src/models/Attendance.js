const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'On Leave', 'Late'],
    default: 'Present'
  },
  checkIn: String,
  checkOut: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
