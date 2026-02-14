const express = require('express');
const upload = require('../middleware/upload');
const { pool } = require('../config/db');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Upload profile photo for driver
router.post('/driver/profile-photo', authenticateToken, upload.singlePhoto, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded'
      });
    }

    // Generate URL for the uploaded file
    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        url: photoUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo'
    });
  }
});

// Upload driving license for driver
router.post('/driver/license', authenticateToken, upload.singleLicense, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No license uploaded'
      });
    }

    // Generate URL for the uploaded file
    const licenseUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Driving license uploaded successfully',
      data: {
        url: licenseUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('License upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload driving license'
    });
  }
});

// Upload photo for any entity (generic)
router.post('/photo', authenticateToken, upload.singlePhoto, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded'
      });
    }

    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        url: photoUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo'
    });
  }
});

// Upload photo for vehicle
router.post('/vehicle/photo', authenticateToken, upload.singlePhoto, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded'
      });
    }

    console.log('File uploaded:', req.file.filename);
    
    // Return full URL for backend API
    const photoUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Vehicle photo uploaded successfully',
      url: photoUrl,
      path: photoUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Vehicle photo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload vehicle photo'
    });
  }
});

// Upload photo for hotel
router.post('/hotel/photo', authenticateToken, upload.singlePhoto, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded'
      });
    }

    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Hotel photo uploaded successfully',
      url: photoUrl,
      path: photoUrl,
      data: {
        url: photoUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Hotel photo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload hotel photo'
    });
  }
});

// Upload profile photo for tour guide
router.post('/tour-guide/profile-photo', authenticateToken, upload.singlePhoto, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded'
      });
    }

    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        url: photoUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Tour guide photo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo'
    });
  }
});

module.exports = router;
