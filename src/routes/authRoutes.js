const express = require('express');
const { register, login, getMe, logout, getUsers, deleteUser, updateUser, updateHospital, updatePassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin', 'ward', 'staff'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.put('/hospital', protect, authorize('admin'), updateHospital);
router.put('/updatepassword', protect, updatePassword);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/logout', logout);

module.exports = router;
