const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwt');
const { 
  getAllDrivers, 
  getDriverById, 
  getAvailableDrivers,
  getDriverByUserId,
  updateDriverProfile,
  deleteDriver
} = require('../controllers/driverController');

// Public routes
router.get('/', getAllDrivers);
router.get('/available', getAvailableDrivers);

// Driver routes (protected) - MUST come before /:id
router.get('/profile/me', authenticateToken, getDriverByUserId);
router.put('/profile/update', authenticateToken, updateDriverProfile);

// This must come last
router.get('/:id', getDriverById);
router.delete('/:id', authenticateToken, deleteDriver);

module.exports = router;