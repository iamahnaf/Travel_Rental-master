const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwt');
const { 
  getAllHotels, 
  getHotelById, 
  getAvailableHotels,
  getOwnerHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  addRoom,
  updateRoom,
  deleteRoom,
  getHotelRooms
} = require('../controllers/hotelController');

// Public routes
router.get('/', getAllHotels);
router.get('/available', getAvailableHotels);

// Owner routes (protected) - MUST come before /:id
router.get('/owner/list', authenticateToken, getOwnerHotels);

// These with :id must come after specific routes
router.get('/:id', getHotelById);
router.get('/:hotelId/rooms', getHotelRooms);
router.post('/', authenticateToken, createHotel);
router.put('/:id', authenticateToken, updateHotel);
router.delete('/:id', authenticateToken, deleteHotel);

// Room management
router.post('/:hotelId/rooms', authenticateToken, addRoom);
router.put('/rooms/:roomId', authenticateToken, updateRoom);
router.delete('/rooms/:roomId', authenticateToken, deleteRoom);

module.exports = router;