const express = require('express');
const router = express.Router();
const { getAssets, createAsset, updateAsset } = require('../controllers/assetController');

router.get('/', getAssets);
router.post('/', createAsset);
router.put('/:id', updateAsset);

module.exports = router;
