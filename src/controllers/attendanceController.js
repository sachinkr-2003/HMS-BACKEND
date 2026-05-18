const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res) => {
    try {
        const query = {};
        if (req.query.date) {
            const d = new Date(req.query.date);
            query.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
        }
        const records = await Attendance.find(query).populate('staff', 'name email role');
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { staff, date, status, checkIn, notes } = req.body;
        // Upsert: one record per staff per day
        const d = new Date(date);
        const start = new Date(d.setHours(0,0,0,0));
        const end = new Date(d.setHours(23,59,59,999));

        const record = await Attendance.findOneAndUpdate(
            { staff, date: { $gte: start, $lte: end } },
            { staff, date: new Date(date), status, checkIn, notes },
            { upsert: true, new: true }
        ).populate('staff', 'name email role');

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
