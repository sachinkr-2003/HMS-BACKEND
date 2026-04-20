const express = require('express');
const router = express.Router();
const { createLabTest, getLabTests, updateLabResult } = require('../controllers/labController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createLabTest)
    .get(protect, getLabTests);

router.put('/:id', protect, updateLabResult);

module.exports = router;
