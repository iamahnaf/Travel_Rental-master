const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwt');
const { 
  getAllVehicles, 
  getVehicleById, 
  getAvailableVehicles,
  getOwnerVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

// Public routes
router.get('/', getAllVehicles);
router.get('/available', getAvailableVehicles);

// Owner routes (protected) - MUST come before /:id
router.get('/owner/list', authenticateToken, getOwnerVehicles);
router.post('/', authenticateToken, createVehicle);
router.put('/:id', authenticateToken, updateVehicle);
router.delete('/:id', authenticateToken, deleteVehicle);

// This must be last because /:id matches anything
router.get('/:id', getVehicleById);

module.exports = router;