const express = require('express');
const router = express.Router();
const { 
  getAllPromoCodes, 
  validatePromoCode 
} = require('../controllers/promoController');

// Public routes
router.get('/', getAllPromoCodes);
router.post('/validate', validatePromoCode);

module.exports = router;