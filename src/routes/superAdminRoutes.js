const express = require('express');
const router = express.Router();
const {
    getHospitals,
    createHospital,
    toggleHospitalStatus
} = require('../controllers/superAdminController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require superadmin access
router.use(protect);
router.use(authorize('superadmin'));

router.route('/hospitals')
    .get(getHospitals)
    .post(createHospital);

router.route('/hospitals/:id/toggle')
    .put(toggleHospitalStatus);

module.exports = router;
