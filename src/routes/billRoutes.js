const express = require('express');
const router = express.Router();
const { createBill, getBills, getBill, payBill, downloadInvoice } = require('../controllers/billingController');
const { protect } = require('../middleware/authMiddleware');

// Define specific routes BEFORE greedy ones
router.get('/download/:id', downloadInvoice); // Public download route

router.route('/')
    .post(protect, createBill)
    .get(protect, getBills);

router.get('/:id', protect, getBill);
router.put('/:id/pay', protect, payBill);

module.exports = router;
