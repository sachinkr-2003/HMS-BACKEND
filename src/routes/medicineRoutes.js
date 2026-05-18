const express = require('express');
const { addMedicine, getMedicines, updateStock, checkExpiry, deleteMedicine, getLowStock } = require('../controllers/medicineController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getMedicines)
    .post(protect, authorize('admin', 'pharmacy'), addMedicine);

router.delete('/:id', protect, authorize('admin', 'pharmacy'), deleteMedicine);
router.put('/:id/stock', protect, updateStock);
router.get('/expiry-check', protect, checkExpiry);
router.get('/low-stock', protect, getLowStock);

module.exports = router;
