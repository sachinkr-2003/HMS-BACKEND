const express = require('express');
const { addBed, getBeds, assignBed, dischargeBed } = require('../controllers/bedController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getBeds)
    .post(protect, authorize('admin'), addBed);

router.put('/:id/assign', protect, assignBed);
router.put('/:id/discharge', protect, dischargeBed);

module.exports = router;
