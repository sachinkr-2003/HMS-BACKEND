const Telemedicine = require('../models/Telemedicine');

exports.getConsultations = async (req, res) => {
    try {
        const consultations = await Telemedicine.find()
            .populate('patient', 'name')
            .populate('doctor', 'name specialization');
        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.scheduleConsultation = async (req, res) => {
    try {
        // Generate a random meeting link if not provided
        const meetingLink = req.body.meetingLink || `https://meet.healthrekha.com/${Math.random().toString(36).substring(7)}`;
        const consultation = await Telemedicine.create({ ...req.body, meetingLink });
        res.status(201).json(consultation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
