const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authenticateToken } = require('../utils/jwt');
const { 
  uploadDrivingLicense,
  checkApprovedLicense,
  getUserDrivingLicense,
  adminUpdateLicenseStatus,
  adminGetPendingLicenses
} = require('../controllers/licenseController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/licenses/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'license-' + uniqueSuffix + path.extname(file.originalname));
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
router.post('/upload', authenticateToken, upload.single('license'), uploadDrivingLicense);
router.get('/check', authenticateToken, checkApprovedLicense);
router.get('/my-license', authenticateToken, getUserDrivingLicense);

// Admin routes (these would need admin authentication in production)
// For now, using the same authenticateToken but in real app, check user role
router.put('/:licenseId/status', authenticateToken, adminUpdateLicenseStatus);
router.get('/pending', authenticateToken, adminGetPendingLicenses);

module.exports = router;