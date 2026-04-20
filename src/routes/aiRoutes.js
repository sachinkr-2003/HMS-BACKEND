const express = require('express');
const { 
    analyzeSymptoms, 
    structureDoctorNotes, 
    predictTrends, 
    generateFollowUp, 
    chatbotResponse, 
    optimizeRevenue 
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/chat', chatbotResponse);
router.post('/diagnose', analyzeSymptoms);
router.post('/structure-notes', protect, structureDoctorNotes);
router.post('/predict-trends', protect, predictTrends);
router.post('/follow-up', protect, generateFollowUp);
router.post('/optimize-revenue', protect, optimizeRevenue);

module.exports = router;
