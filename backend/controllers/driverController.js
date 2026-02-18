const { pool } = require('../config/db');

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    
    // Try to query with license_url first
    let query = `
      SELECT id, name, photo_url, license_url, experience_years, rating, total_rides, 
             languages, location, city, bio, available, price_per_day, created_at
      FROM drivers
      WHERE available = 1
      ORDER BY rating DESC, total_rides DESC
    `;
    
    let rows;
    try {
      [rows] = await pool.execute(query);
    } catch (queryError) {
      // If license_url column doesn't exist, fall back to query without it
      if (queryError.message.includes('Unknown column') && queryError.message.includes('license_url')) {
        query = `
          SELECT id, name, photo_url, experience_years, rating, total_rides, 
                 languages, location, city, bio, available, price_per_day, created_at
          FROM drivers
          WHERE available = 1
          ORDER BY rating DESC, total_rides DESC
        `;
        [rows] = await pool.execute(query);
      } else {
        throw queryError; // Re-throw if it's a different error
      }
    }

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get driver by ID
const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to query with license_url first
    let query = `
      SELECT id, name, photo_url, license_url, experience_years, rating, total_rides, 
             languages, location, city, bio, available, price_per_day, created_at
      FROM drivers
      WHERE id = ?
    `;
    
    let rows;
    try {
      [rows] = await pool.execute(query, [id]);
    } catch (queryError) {
      // If license_url column doesn't exist, fall back to query without it
      if (queryError.message.includes('Unknown column') && queryError.message.includes('license_url')) {
        query = `
          SELECT id, name, photo_url, experience_years, rating, total_rides, 
                 languages, location, city, bio, available, price_per_day, created_at
          FROM drivers
          WHERE id = ?
        `;
        [rows] = await pool.execute(query, [id]);
      } else {
        throw queryError; // Re-throw if it's a different error
      }
    }

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Fetch reviews for this driver
    const reviewsQuery = `
      SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.reviewable_type = 'driver' AND r.reviewable_id = ?
      ORDER BY r.created_at DESC
    `;
    let reviews = [];
    try {
      const [reviewRows] = await pool.execute(reviewsQuery, [id]);
      reviews = reviewRows;
    } catch (reviewError) {
      console.error('Error fetching driver reviews:', reviewError);
    }

    res.status(200).json({
      success: true,
      data: { ...rows[0], reviews }
    });
  } catch (error) {
    console.error('Get driver by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get available drivers for booking
const getAvailableDrivers = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Convert dates to proper format if needed
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

    // Try to query with license_url first
    let query = `
      SELECT d.id, d.name, d.photo_url, d.license_url, d.experience_years, d.rating, d.total_rides, 
             d.languages, d.location, d.city, d.bio, d.available, d.price_per_day, d.created_at
      FROM drivers d
      WHERE d.available = 1
        AND NOT EXISTS (
          SELECT 1
          FROM bookings b
          WHERE b.driver_id = d.id
            AND b.booking_type = 'driver'
            AND b.status != 'cancelled'
            AND (
              (DATE(?) BETWEEN b.start_date AND b.end_date) OR
              (DATE(?) BETWEEN b.start_date AND b.end_date) OR
              (DATE(?) <= b.start_date AND DATE(?) >= b.end_date)
            )
        )
    `;
    
    let rows;
    try {
      [rows] = await pool.execute(query, [
        formattedStartDate,  // startDate
        formattedEndDate,    // endDate
        formattedStartDate,  // startDate
        formattedEndDate     // endDate
      ]);
    } catch (queryError) {
      // If license_url column doesn't exist, fall back to query without it
      if (queryError.message.includes('Unknown column') && queryError.message.includes('license_url')) {
        query = `
          SELECT d.id, d.name, d.photo_url, d.experience_years, d.rating, d.total_rides, 
                 d.languages, d.location, d.city, d.bio, d.available, d.price_per_day, d.created_at
          FROM drivers d
          WHERE d.available = 1
            AND NOT EXISTS (
              SELECT 1
              FROM bookings b
              WHERE b.driver_id = d.id
                AND b.booking_type = 'driver'
                AND b.status != 'cancelled'
                AND (
                  (DATE(?) BETWEEN b.start_date AND b.end_date) OR
                  (DATE(?) BETWEEN b.start_date AND b.end_date) OR
                  (DATE(?) <= b.start_date AND DATE(?) >= b.end_date)
                )
            )
        `;
        [rows] = await pool.execute(query, [
          formattedStartDate,  // startDate
          formattedEndDate,    // endDate
          formattedStartDate,  // startDate
          formattedEndDate     // endDate
        ]);
      } else {
        throw queryError; // Re-throw if it's a different error
      }
    }

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get available drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get driver by user ID
const getDriverByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = 'SELECT * FROM drivers WHERE user_id = ?';
    const [rows] = await pool.execute(query, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }
    
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get driver by user ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update driver profile
const updateDriverProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, experience_years, city, location, bio, price_per_day, languages, available, photo_url, license_url } = req.body;
    
    // Update user's name in users table as well
    if (name) {
      await pool.execute('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
    }
    
    // Build dynamic query to handle potentially missing license_url column
    let query;
    let params;
    
    if (license_url !== undefined) {
      // Include license_url in the update
      query = `
        UPDATE drivers SET 
          name = ?, experience_years = ?, city = ?, location = ?, 
          bio = ?, price_per_day = ?, languages = ?, available = ?,
          photo_url = ?, license_url = ?
        WHERE user_id = ?
      `;
      params = [
        name, experience_years, city, location, bio, price_per_day, 
        JSON.stringify(languages || []), available ? 1 : 0, 
        photo_url || null, license_url || null, userId
      ];
    } else {
      // Update without license_url
      query = `
        UPDATE drivers SET 
          name = ?, experience_years = ?, city = ?, location = ?, 
          bio = ?, price_per_day = ?, languages = ?, available = ?,
          photo_url = ?
        WHERE user_id = ?
      `;
      params = [
        name, experience_years, city, location, bio, price_per_day, 
        JSON.stringify(languages || []), available ? 1 : 0, 
        photo_url || null, userId
      ];
    }
    
    await pool.execute(query, params);
    
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update driver profile error:', error);
    // Check if the error is related to the license_url column
    if (error.message.includes('license_url') || error.message.includes('Unknown column')) {
      try {
        // Try updating without license_url field
        const userId = req.user.userId;
        const { name, experience_years, city, location, bio, price_per_day, languages, available, photo_url } = req.body;
        
        // Update user's name in users table as well
        if (name) {
          await pool.execute('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
        }
        
        const fallbackQuery = `
          UPDATE drivers SET 
            name = ?, experience_years = ?, city = ?, location = ?, 
            bio = ?, price_per_day = ?, languages = ?, available = ?,
            photo_url = ?
          WHERE user_id = ?
        `;
        
        await pool.execute(fallbackQuery, [
          name, experience_years, city, location, bio, price_per_day, 
          JSON.stringify(languages || []), available ? 1 : 0, 
          photo_url || null, userId
        ]);
        
        res.status(200).json({ success: true, message: 'Profile updated successfully (without license URL - column may not exist yet)' });
      } catch (fallbackError) {
        console.error('Fallback update error:', fallbackError);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    } else {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

// Delete driver (admin only or owner)
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Admin can delete any driver, otherwise check ownership
    if (userRole !== 'admin') {
      const checkQuery = 'SELECT id FROM drivers WHERE id = ? AND user_id = ?';
      const [rows] = await pool.execute(checkQuery, [id, userId]);
      if (rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Unauthorized or driver not found' });
      }
    } else {
      // Admin: just check if driver exists
      const checkQuery = 'SELECT id FROM drivers WHERE id = ?';
      const [rows] = await pool.execute(checkQuery, [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Driver not found' });
      }
    }

    await pool.execute('DELETE FROM drivers WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  getAvailableDrivers,
  getDriverByUserId,
  updateDriverProfile,
  deleteDriver
};