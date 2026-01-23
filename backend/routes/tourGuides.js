const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwt');
const { 
  getAllTourGuides, 
  getTourGuideById, 
  getAvailableTourGuides,
  getTourGuideByUserId,
  updateTourGuideProfile
} = require('../controllers/tourGuideController');

// Public routes
router.get('/', getAllTourGuides);
router.get('/available', getAvailableTourGuides);

// Guide routes (protected) - MUST come before /:id
router.get('/profile/me', authenticateToken, getTourGuideByUserId);
router.put('/profile/update', authenticateToken, updateTourGuideProfile);

// This must come last
router.get('/:id', getTourGuideById);

module.exports = router;