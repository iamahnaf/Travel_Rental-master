const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../utils/jwt');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

// Admin routes
router.get('/', authenticateToken, getAllUsers);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;