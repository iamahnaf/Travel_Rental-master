const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { authenticateToken } = require('../utils/jwt');
const { 
  uploadNidCard, 
  getUserNidCard,
  adminUpdateNidStatus,
  adminGetPendingNids
} = require('../controllers/nidController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'nids');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'nid-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// User routes
router.post('/upload', authenticateToken, upload.single('nid'), uploadNidCard);
router.get('/my-nid', authenticateToken, getUserNidCard);

// Admin routes (these would need admin authentication in production)
// For now, using the same authenticateToken but in real app, check user role
router.put('/:nidId/status', authenticateToken, adminUpdateNidStatus);
router.get('/pending', authenticateToken, adminGetPendingNids);

module.exports = router;