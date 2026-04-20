const express = require('express');
const { addMedicine, getMedicines, updateStock, checkExpiry, deleteMedicine } = require('../controllers/medicineController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getMedicines)
    .post(protect, authorize('admin', 'pharmacy'), addMedicine);

router.delete('/:id', protect, authorize('admin', 'pharmacy'), deleteMedicine);
router.put('/:id/stock', protect, updateStock);
router.get('/expiry-check', protect, checkExpiry);

module.exports = router;
