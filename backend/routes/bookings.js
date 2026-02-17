const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwt');
const { 
  createBooking, 
  getUserBookings, 
  getBookingById, 
  cancelBooking,
  getBusinessBookings,
  acceptBooking,
  rejectBooking,
  getAllBookings,
  deleteBooking
} = require('../controllers/bookingController');

// Protected routes
router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getUserBookings);
router.get('/all', authenticateToken, getAllBookings);
router.get('/business/requests', authenticateToken, getBusinessBookings);
router.get('/:id', authenticateToken, getBookingById);
router.put('/:id/cancel', authenticateToken, cancelBooking);
router.put('/:id/accept', authenticateToken, acceptBooking);
router.put('/:id/reject', authenticateToken, rejectBooking);
router.delete('/:id', authenticateToken, deleteBooking);

module.exports = router;