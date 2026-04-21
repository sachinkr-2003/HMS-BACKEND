const express = require('express');
const router = express.Router();
const { getRoster, assignShift } = require('../controllers/rosterController');

router.get('/', getRoster);
router.post('/assign', assignShift);

module.exports = router;
