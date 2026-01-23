const { pool } = require('../config/db');

// Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const query = `
      SELECT id, name, location, city, price_per_night, image_urls, 
             available_rooms, total_rooms, rating, amenities, description, created_at
      FROM hotels
      WHERE available_rooms > 0
      ORDER BY rating DESC, price_per_night ASC
    `;
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get hotel by ID
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, name, location, city, price_per_night, image_urls, 
             available_rooms, total_rooms, rating, amenities, description, created_at
      FROM hotels
      WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get hotel by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get available hotels for booking
const getAvailableHotels = async (req, res) => {
  try {
    const { startDate, endDate, city } = req.query;

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

    // Build query with optional city filter
    let query = `
      SELECT h.id, h.name, h.location, h.city, h.price_per_night, h.image_urls, 
             h.available_rooms, h.total_rooms, h.rating, h.amenities, h.description, h.created_at
      FROM hotels h
      WHERE h.available_rooms > 0
    `;

    const params = [];

    // Add city filter if provided
    if (city) {
      query += ` AND h.city LIKE ? `;
      params.push(`%${city}%`);
    }

    // Add availability check
    query += `
      AND h.id NOT IN (
        SELECT hotel_id
        FROM bookings
        WHERE booking_type = 'hotel'
          AND status != 'cancelled'
          AND (
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) <= start_date AND DATE(?) >= end_date)
          )
      )
    `;

    // Add date parameters to params array
    params.push(
      formattedStartDate,  // startDate
      formattedEndDate,    // endDate
      formattedStartDate,  // startDate
      formattedEndDate     // endDate
    );

    query += ` ORDER BY h.rating DESC, h.price_per_night ASC`;

    const [rows] = await pool.execute(query, params);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get available hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get hotels owned by the current user
const getOwnerHotels = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = `
      SELECT id, name, location, city, price_per_night, image_urls as image_url, 
             available_rooms as rooms_available, total_rooms, rating, amenities, description,
             contact_phone, contact_email, created_at,
             CASE WHEN available_rooms > 0 THEN 1 ELSE 0 END as available
      FROM hotels
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query, [userId]);

    // Transform the data for frontend
    const transformedRows = rows.map(row => ({
      ...row,
      image_url: typeof row.image_url === 'string' && row.image_url.startsWith('[') 
        ? JSON.parse(row.image_url)[0] || '' 
        : row.image_url || '',
      amenities: typeof row.amenities === 'string' && row.amenities.startsWith('[')
        ? JSON.parse(row.amenities).join(', ')
        : row.amenities || '',
      available: row.available === 1
    }));

    res.status(200).json(transformedRows);
  } catch (error) {
    console.error('Get owner hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new hotel
const createHotel = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      name, location, city, price_per_night, image_urls, image_url,
      available_rooms, rooms_available, total_rooms, amenities, description,
      contact_phone, contact_email
    } = req.body;

    // Handle both image_url and image_urls from frontend
    let imageUrls = image_urls;
    if (!imageUrls && image_url) {
      imageUrls = [image_url];
    }

    // Handle both available_rooms and rooms_available
    const roomsAvailable = available_rooms || rooms_available || 1;

    // Handle amenities - could be string or array
    let amenitiesJson = amenities;
    if (typeof amenities === 'string') {
      amenitiesJson = amenities.split(',').map(a => a.trim()).filter(a => a);
    }

    const query = `
      INSERT INTO hotels (
        user_id, name, location, city, price_per_night, image_urls, 
        available_rooms, total_rooms, amenities, description, contact_phone, contact_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      userId, name, location || city, city || location, price_per_night || 0, 
      JSON.stringify(imageUrls || []), 
      roomsAvailable, total_rooms || roomsAvailable, 
      JSON.stringify(amenitiesJson || []), 
      description || '',
      contact_phone || '',
      contact_email || ''
    ]);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { 
      name, location, city, price_per_night, image_urls, image_url,
      available_rooms, rooms_available, total_rooms, amenities, description,
      contact_phone, contact_email, available
    } = req.body;

    // Check ownership
    const checkQuery = 'SELECT id FROM hotels WHERE id = ? AND user_id = ?';
    const [rows] = await pool.execute(checkQuery, [id, userId]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or hotel not found' });
    }

    // Handle both image_url and image_urls from frontend
    let imageUrls = image_urls;
    if (!imageUrls && image_url) {
      imageUrls = [image_url];
    }

    // Handle both available_rooms and rooms_available
    let roomsAvailable = available_rooms || rooms_available || 1;
    
    // If available is false, set rooms to 0
    if (available === false) {
      roomsAvailable = 0;
    }

    // Handle amenities - could be string or array
    let amenitiesJson = amenities;
    if (typeof amenities === 'string') {
      amenitiesJson = amenities.split(',').map(a => a.trim()).filter(a => a);
    }

    const query = `
      UPDATE hotels SET 
        name = ?, location = ?, city = ?, price_per_night = ?, 
        image_urls = ?, available_rooms = ?, total_rooms = ?, 
        amenities = ?, description = ?, contact_phone = ?, contact_email = ?
      WHERE id = ?
    `;
    
    await pool.execute(query, [
      name, location || city, city || location, price_per_night || 0, 
      JSON.stringify(imageUrls || []), 
      roomsAvailable, total_rooms || roomsAvailable, 
      JSON.stringify(amenitiesJson || []), 
      description || '',
      contact_phone || '',
      contact_email || '',
      id
    ]);

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully'
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete hotel
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check ownership
    const checkQuery = 'SELECT id FROM hotels WHERE id = ? AND user_id = ?';
    const [rows] = await pool.execute(checkQuery, [id, userId]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or hotel not found' });
    }

    await pool.execute('DELETE FROM hotels WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
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
};

// --- Room Management ---

// Add a room to a hotel
async function addRoom(req, res) {
  try {
    const { hotelId } = req.params;
    const userId = req.user.userId;
    const { room_type, room_number, hourly_rate, daily_rate, max_occupancy, image_urls } = req.body;

    // Check hotel ownership
    const [hotel] = await pool.execute('SELECT id FROM hotels WHERE id = ? AND user_id = ?', [hotelId, userId]);
    if (hotel.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or hotel not found' });
    }

    const query = `
      INSERT INTO hotel_rooms (hotel_id, room_type, room_number, hourly_rate, daily_rate, max_occupancy, image_urls)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      hotelId, room_type, room_number, hourly_rate, daily_rate, max_occupancy, JSON.stringify(image_urls || [])
    ]);

    res.status(201).json({
      success: true,
      message: 'Room added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add room error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Update a room
async function updateRoom(req, res) {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    const { room_type, room_number, hourly_rate, daily_rate, max_occupancy, image_urls, available } = req.body;

    // Check ownership through hotel
    const checkQuery = `
      SELECT r.id FROM hotel_rooms r
      JOIN hotels h ON r.hotel_id = h.id
      WHERE r.id = ? AND h.user_id = ?
    `;
    const [rows] = await pool.execute(checkQuery, [roomId, userId]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or room not found' });
    }

    const query = `
      UPDATE hotel_rooms SET 
        room_type = ?, room_number = ?, hourly_rate = ?, 
        daily_rate = ?, max_occupancy = ?, image_urls = ?, available = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      room_type, room_number, hourly_rate, daily_rate, max_occupancy, 
      JSON.stringify(image_urls || []), available ? 1 : 0, roomId
    ]);

    res.status(200).json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Delete a room
async function deleteRoom(req, res) {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    // Check ownership
    const checkQuery = `
      SELECT r.id FROM hotel_rooms r
      JOIN hotels h ON r.hotel_id = h.id
      WHERE r.id = ? AND h.user_id = ?
    `;
    const [rows] = await pool.execute(checkQuery, [roomId, userId]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or room not found' });
    }

    await pool.execute('DELETE FROM hotel_rooms WHERE id = ?', [roomId]);
    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Get rooms for a hotel
async function getHotelRooms(req, res) {
  try {
    const { hotelId } = req.params;
    const [rows] = await pool.execute('SELECT * FROM hotel_rooms WHERE hotel_id = ?', [hotelId]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Get hotel rooms error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}