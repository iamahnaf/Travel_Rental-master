const { pool } = require('../config/db');

// Upload NID card
const uploadNidCard = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'NID card image file is required'
      });
    }

    const { number } = req.body;

    // Validate NID number format (10, 13, or 17 digits)
    if (!number || !/^\d{10}$|^\d{13}$|^\d{17}$/.test(number)) {
      return res.status(400).json({
        success: false,
        message: 'NID number is required and must be 10, 13, or 17 digits'
      });
    }

    const filePath = `/uploads/nids/${req.file.filename}`;

    // Check if user already has an approved NID
    const checkQuery = `
      SELECT id, status FROM nid_cards 
      WHERE user_id = ? 
      AND status = 'approved'
    `;
    const [checkResult] = await pool.execute(checkQuery, [userId]);

    if (checkResult.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have an approved NID card'
      });
    }

    // Insert the new NID (auto-approved for convenience)
    const insertQuery = `
      INSERT INTO nid_cards (user_id, number, file_path, status, uploaded_at, verified_at) 
      VALUES (?, ?, ?, 'approved', NOW(), NOW())
    `;
    await pool.execute(insertQuery, [userId, number, filePath]);

    res.status(200).json({
      success: true,
      message: 'NID card uploaded successfully',
      data: {
        number,
        file_path: filePath,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Upload NID card error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's NID card
const getUserNidCard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT id, number, file_path, status, uploaded_at, verified_at 
      FROM nid_cards 
      WHERE user_id = ?
      ORDER BY uploaded_at DESC
      LIMIT 1
    `;
    const [rows] = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No NID card found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get user NID card error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin: Approve or reject NID card
const adminUpdateNidStatus = async (req, res) => {
  try {
    const { nidId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    const updateQuery = `
      UPDATE nid_cards 
      SET status = ?, verified_at = NOW()
      WHERE id = ?
    `;
    const [result] = await pool.execute(updateQuery, [status, nidId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'NID card not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `NID card ${status} successfully`
    });
  } catch (error) {
    console.error('Admin update NID status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin: Get all pending NIDs
const adminGetPendingNids = async (req, res) => {
  try {
    const query = `
      SELECT nc.id, nc.number, nc.file_path, nc.uploaded_at, u.name, u.email
      FROM nid_cards nc
      JOIN users u ON nc.user_id = u.id
      WHERE nc.status = 'pending'
      ORDER BY nc.uploaded_at DESC
    `;
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Admin get pending NIDs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  uploadNidCard,
  getUserNidCard,
  adminUpdateNidStatus,
  adminGetPendingNids
};