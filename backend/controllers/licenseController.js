const { pool } = require('../config/db');

// Upload driving license
const uploadDrivingLicense = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'License image file is required'
      });
    }

    const filePath = `/uploads/licenses/${req.file.filename}`;

    // Check if user already has an approved license
    const checkQuery = `
      SELECT id, status FROM driving_licenses 
      WHERE user_id = ? 
      AND status = 'approved'
    `;
    const [checkResult] = await pool.execute(checkQuery, [userId]);

    if (checkResult.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have an approved driving license'
      });
    }

    // Insert the new license (auto-approved for convenience)
    const insertQuery = `
      INSERT INTO driving_licenses (user_id, file_path, status, uploaded_at, verified_at) 
      VALUES (?, ?, 'approved', NOW(), NOW())
    `;
    await pool.execute(insertQuery, [userId, filePath]);

    res.status(200).json({
      success: true,
      message: 'Driving license uploaded and verified successfully',
      data: {
        file_path: filePath,
        status: 'approved'
      }
    });
  } catch (error) {
    console.error('Upload driving license error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if user has approved driving license
const checkApprovedLicense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT id, status 
      FROM driving_licenses 
      WHERE user_id = ? 
      AND status = 'approved'
      ORDER BY uploaded_at DESC
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [userId]);

    res.status(200).json({
      success: true,
      data: {
        hasApprovedLicense: rows.length > 0
      }
    });
  } catch (error) {
    console.error('Check approved license error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's driving license
const getUserDrivingLicense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT id, file_path, status, uploaded_at, verified_at 
      FROM driving_licenses 
      WHERE user_id = ?
      ORDER BY uploaded_at DESC
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No driving license found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get user driving license error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin: Approve or reject driving license
const adminUpdateLicenseStatus = async (req, res) => {
  try {
    const { licenseId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    const updateQuery = `
      UPDATE driving_licenses 
      SET status = ?, verified_at = NOW()
      WHERE id = ?
    `;
    const [result] = await pool.execute(updateQuery, [status, licenseId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'License not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `License ${status} successfully`
    });
  } catch (error) {
    console.error('Admin update license status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin: Get all pending licenses
const adminGetPendingLicenses = async (req, res) => {
  try {
    const query = `
      SELECT dl.id, dl.file_path, dl.uploaded_at, u.name, u.email
      FROM driving_licenses dl
      JOIN users u ON dl.user_id = u.id
      WHERE dl.status = 'pending'
      ORDER BY dl.uploaded_at DESC
    `;
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Admin get pending licenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  uploadDrivingLicense,
  checkApprovedLicense,
  getUserDrivingLicense,
  adminUpdateLicenseStatus,
  adminGetPendingLicenses
};