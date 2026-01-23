const { pool } = require('../config/db');

// Get all tour guides
const getAllTourGuides = async (req, res) => {
  try {
    const query = `
      SELECT id, name, photo_url, location, city, languages, 
             specialties, experience_years, rating, total_tours, 
             price_per_day, bio, available, created_at
      FROM tour_guides
      WHERE available = 1
      ORDER BY rating DESC, total_tours DESC
    `;
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all tour guides error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get tour guide by ID
const getTourGuideById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, name, photo_url, location, city, languages, 
             specialties, experience_years, rating, total_tours, 
             price_per_day, bio, available, created_at
      FROM tour_guides
      WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tour guide not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get tour guide by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get available tour guides for booking
const getAvailableTourGuides = async (req, res) => {
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

    // SQL query to find available tour guides
    const query = `
      SELECT tg.id, tg.name, tg.photo_url, tg.location, tg.city, tg.languages, 
             tg.specialties, tg.experience_years, tg.rating, tg.total_tours, 
             tg.price_per_day, tg.bio, tg.available, tg.created_at
      FROM tour_guides tg
      WHERE tg.available = 1
        AND NOT EXISTS (
          SELECT 1
          FROM bookings b
          WHERE b.tour_guide_id = tg.id
            AND b.booking_type = 'tour-guide'
            AND b.status != 'cancelled'
            AND (
              (DATE(?) BETWEEN b.start_date AND b.end_date) OR
              (DATE(?) BETWEEN b.start_date AND b.end_date) OR
              (DATE(?) <= b.start_date AND DATE(?) >= b.end_date)
            )
        )
    `;
    
    const [rows] = await pool.execute(query, [
      formattedStartDate,  // startDate
      formattedEndDate,    // endDate
      formattedStartDate,  // startDate
      formattedEndDate     // endDate
    ]);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get available tour guides error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get tour guide by user ID
const getTourGuideByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = 'SELECT * FROM tour_guides WHERE user_id = ?';
    const [rows] = await pool.execute(query, [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tour guide profile not found' });
    }
    
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get tour guide by user ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update tour guide profile
const updateTourGuideProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, experience_years, city, location, bio, price_per_day, languages, specialties, available } = req.body;
    
    const query = `
      UPDATE tour_guides SET 
        name = ?, experience_years = ?, city = ?, location = ?, 
        bio = ?, price_per_day = ?, languages = ?, specialties = ?, available = ?
      WHERE user_id = ?
    `;
    
    await pool.execute(query, [
      name, experience_years, city, location, bio, price_per_day, 
      JSON.stringify(languages || []), JSON.stringify(specialties || []), available ? 1 : 0, userId
    ]);
    
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update tour guide profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllTourGuides,
  getTourGuideById,
  getAvailableTourGuides,
  getTourGuideByUserId,
  updateTourGuideProfile
};