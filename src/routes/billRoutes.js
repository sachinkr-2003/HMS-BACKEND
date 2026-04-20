const express = require('express');
const router = express.Router();
const { createBill, getBills, getBill, payBill } = require('../controllers/billingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBill)
    .get(protect, getBills);

router.get('/:id', protect, getBill);
router.put('/:id/pay', protect, payBill);

module.exports = router;
