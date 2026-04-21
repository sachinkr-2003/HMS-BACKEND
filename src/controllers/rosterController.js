const Roster = require('../models/Roster');

exports.getRoster = async (req, res) => {
    try {
        const query = {};
        if (req.query.date) query.date = new Date(req.query.date);
        
        const roster = await Roster.find(query).populate('personnel', 'name email');
        res.status(200).json(roster);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignShift = async (req, res) => {
    try {
        const shift = await Roster.create(req.body);
        res.status(201).json(shift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
