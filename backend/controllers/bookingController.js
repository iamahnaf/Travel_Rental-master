const { pool } = require('../config/db');

// Create a new booking
const createBooking = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const userId = req.user.userId;
    const userRole = req.user.role;

    // CLEAN ACCOUNT SEPARATION: Business users cannot book services
    if (userRole !== 'traveler' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Business accounts cannot book services. Please create a traveler account to book.'
      });
    }

    const { 
      booking_type, 
      vehicle_id, 
      hotel_id, 
      driver_id, 
      tour_guide_id, 
      start_date, 
      end_date, 
      pickup_lat, 
      pickup_lng, 
      pickup_address,
      destination_lat,
      destination_lng,
      destination_address,
      total_price,
      promo_code_id  // Optional promo code
    } = req.body;

    // Validate required fields based on booking type
    if (!booking_type || !start_date || !end_date || !total_price) {
      return res.status(400).json({
        success: false,
        message: 'Booking type, start date, end date, and total price are required'
      });
    }

    // Validate booking type
    const validBookingTypes = ['vehicle', 'hotel', 'driver', 'tour-guide'];
    if (!validBookingTypes.includes(booking_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking type'
      });
    }

    // Validate required IDs based on booking type
    if (booking_type === 'vehicle' && !vehicle_id) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID is required for vehicle booking'
      });
    }
    if (booking_type === 'hotel' && !hotel_id) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required for hotel booking'
      });
    }
    if (booking_type === 'driver' && !driver_id) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required for driver booking'
      });
    }
    if (booking_type === 'tour-guide' && !tour_guide_id) {
      return res.status(400).json({
        success: false,
        message: 'Tour guide ID is required for tour guide booking'
      });
    }

    // Check if user has approved driving license when booking without driver
    if (booking_type === 'vehicle' && !driver_id) {
      const licenseQuery = `
        SELECT status FROM driving_licenses 
        WHERE user_id = ? 
        ORDER BY uploaded_at DESC
        LIMIT 1
      `;
      const [licenseRows] = await connection.execute(licenseQuery, [userId]);

      if (licenseRows.length === 0 || licenseRows[0].status !== 'approved') {
        return res.status(400).json({
          success: false,
          message: 'You must have an approved driving license to rent a vehicle without a driver'
        });
      }
    }

    // Check for overlapping bookings based on booking type
    let conflictQuery = '';
    let conflictParams = [];

    if (booking_type === 'vehicle' && vehicle_id) {
      conflictQuery = `
        SELECT id FROM bookings 
        WHERE booking_type = 'vehicle' 
          AND vehicle_id = ?
          AND status != 'cancelled'
          AND (
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) <= start_date AND DATE(?) >= end_date)
          )
      `;
      conflictParams = [vehicle_id, start_date, end_date, start_date, end_date];
    } else if (booking_type === 'driver' && driver_id) {
      conflictQuery = `
        SELECT id FROM bookings 
        WHERE booking_type = 'driver' 
          AND driver_id = ?
          AND status != 'cancelled'
          AND (
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) <= start_date AND DATE(?) >= end_date)
          )
      `;
      conflictParams = [driver_id, start_date, end_date, start_date, end_date];
    } else if (booking_type === 'tour-guide' && tour_guide_id) {
      conflictQuery = `
        SELECT id FROM bookings 
        WHERE booking_type = 'tour-guide' 
          AND tour_guide_id = ?
          AND status != 'cancelled'
          AND (
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) <= start_date AND DATE(?) >= end_date)
          )
      `;
      conflictParams = [tour_guide_id, start_date, end_date, start_date, end_date];
    }
    // Note: Hotel bookings don't have single-item conflict check here
    // because hotels have multiple rooms - room availability is checked separately below

    if (conflictQuery) {
      const [conflictRows] = await connection.execute(conflictQuery, conflictParams);
      if (conflictRows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'The selected item is already booked for the selected dates'
        });
      }
    }

    // If it's a hotel booking, check room availability
    if (booking_type === 'hotel' && hotel_id) {
      // Check if hotel has available rooms
      const hotelQuery = 'SELECT available_rooms FROM hotels WHERE id = ?';
      const [hotelRows] = await connection.execute(hotelQuery, [hotel_id]);

      if (hotelRows.length === 0 || hotelRows[0].available_rooms <= 0) {
        return res.status(400).json({
          success: false,
          message: 'No rooms available for the selected hotel'
        });
      }

      // Check for overlapping bookings that would exceed available rooms
      const roomConflictQuery = `
        SELECT COUNT(*) as booking_count FROM bookings 
        WHERE booking_type = 'hotel' 
          AND hotel_id = ?
          AND status != 'cancelled'
          AND (
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) BETWEEN start_date AND end_date) OR
            (DATE(?) <= start_date AND DATE(?) >= end_date)
          )
      `;
      const [roomConflictRows] = await connection.execute(roomConflictQuery, [
        hotel_id, start_date, end_date, start_date, end_date
      ]);

      if (roomConflictRows[0].booking_count >= hotelRows[0].available_rooms) {
        return res.status(400).json({
          success: false,
          message: 'No rooms available for the selected dates'
        });
      }
    }

    // Insert the booking
    const insertQuery = `
      INSERT INTO bookings (
        user_id, booking_type, vehicle_id, hotel_id, driver_id, tour_guide_id,
        start_date, end_date, pickup_lat, pickup_lng, pickup_address,
        destination_lat, destination_lng, destination_address,
        total_price, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const [result] = await connection.execute(insertQuery, [
      userId,
      booking_type,
      booking_type === 'vehicle' ? vehicle_id : null,
      booking_type === 'hotel' ? hotel_id : null,
      booking_type === 'driver' ? driver_id : null,
      booking_type === 'tour-guide' ? tour_guide_id : null,
      start_date,
      end_date,
      pickup_lat || null,
      pickup_lng || null,
      pickup_address || null,
      destination_lat || null,
      destination_lng || null,
      destination_address || null,
      total_price
    ]);

    // If promo code was used, increment its usage
    if (promo_code_id) {
      const promoUpdateQuery = `
        UPDATE promo_codes 
        SET used_count = used_count + 1 
        WHERE id = ?
      `;
      await connection.execute(promoUpdateQuery, [promo_code_id]);
    }

    // If it's a hotel booking, decrease available rooms count
    if (booking_type === 'hotel' && hotel_id) {
      const updateHotelRoomsQuery = `
        UPDATE hotels 
        SET available_rooms = available_rooms - 1 
        WHERE id = ?
      `;
      await connection.execute(updateHotelRoomsQuery, [hotel_id]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking_id: result.insertId,
        booking_type,
        start_date,
        end_date,
        total_price,
        status: 'pending'
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    let query = `
      SELECT b.id, b.booking_type, b.start_date, b.end_date, 
             b.pickup_lat, b.pickup_lng, b.pickup_address, 
             b.total_price, b.status, b.created_at,
             v.brand as vehicle_brand, v.model as vehicle_model,
             h.name as hotel_name, h.city as hotel_city,
             d.name as driver_name, d.rating as driver_rating,
             tg.name as tour_guide_name, tg.rating as tour_guide_rating
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN hotels h ON b.hotel_id = h.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      LEFT JOIN tour_guides tg ON b.tour_guide_id = tg.id
      WHERE b.user_id = ?
    `;

    const params = [userId];

    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC`;

    const [rows] = await pool.execute(query, params);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const query = `
      SELECT b.id, b.booking_type, b.start_date, b.end_date, 
             b.pickup_lat, b.pickup_lng, b.pickup_address, 
             b.total_price, b.status, b.created_at,
             v.brand as vehicle_brand, v.model as vehicle_model,
             h.name as hotel_name, h.city as hotel_city,
             d.name as driver_name, d.rating as driver_rating,
             tg.name as tour_guide_name, tg.rating as tour_guide_rating
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN hotels h ON b.hotel_id = h.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      LEFT JOIN tour_guides tg ON b.tour_guide_id = tg.id
      WHERE b.id = ? AND b.user_id = ?
    `;

    const [rows] = await pool.execute(query, [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const userId = req.user.userId;
    const { cancellation_reason } = req.body;

    // Get the booking to check if it exists and belongs to the user
    const getQuery = `
      SELECT id, booking_type, hotel_id, status 
      FROM bookings 
      WHERE id = ? AND user_id = ? AND status != 'cancelled'
    `;
    const [rows] = await connection.execute(getQuery, [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already cancelled'
      });
    }

    const booking = rows[0];

    // Update booking status to cancelled
    const updateQuery = 'UPDATE bookings SET status = "cancelled", cancellation_reason = ? WHERE id = ?';
    await connection.execute(updateQuery, [cancellation_reason || 'Cancelled by traveler', id]);

    // If it was a hotel booking, increase available rooms count
    if (booking.booking_type === 'hotel' && booking.hotel_id) {
      const updateHotelRoomsQuery = `
        UPDATE hotels 
        SET available_rooms = available_rooms + 1 
        WHERE id = ?
      `;
      await connection.execute(updateHotelRoomsQuery, [booking.hotel_id]);
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// Get bookings for business users (driver, tour guide, car owner, hotel owner)
const getBusinessBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { status } = req.query;

    let query = '';
    const params = [userId];

    if (userRole === 'driver') {
      query = `
        SELECT b.id, b.booking_type, b.start_date, b.end_date, 
               b.pickup_lat, b.pickup_lng, b.pickup_address,
               b.destination_lat, b.destination_lng, b.destination_address,
               b.total_price, b.status, b.cancellation_reason, b.created_at,
               u.name as traveler_name, u.email as traveler_email, u.phone as traveler_phone
        FROM bookings b
        INNER JOIN users u ON b.user_id = u.id
        INNER JOIN drivers d ON b.driver_id = d.id
        WHERE d.user_id = ?
      `;
    } else if (userRole === 'tour_guide') {
      query = `
        SELECT b.id, b.booking_type, b.start_date, b.end_date, 
               b.pickup_lat, b.pickup_lng, b.pickup_address,
               b.destination_lat, b.destination_lng, b.destination_address,
               b.total_price, b.status, b.cancellation_reason, b.created_at,
               u.name as traveler_name, u.email as traveler_email, u.phone as traveler_phone
        FROM bookings b
        INNER JOIN users u ON b.user_id = u.id
        INNER JOIN tour_guides tg ON b.tour_guide_id = tg.id
        WHERE tg.user_id = ?
      `;
    } else if (userRole === 'car_owner') {
      query = `
        SELECT b.id, b.booking_type, b.start_date, b.end_date, 
               b.pickup_lat, b.pickup_lng, b.pickup_address,
               b.destination_lat, b.destination_lng, b.destination_address,
               b.total_price, b.status, b.cancellation_reason, b.created_at,
               v.brand as vehicle_brand, v.model as vehicle_model,
               u.name as traveler_name, u.email as traveler_email, u.phone as traveler_phone
        FROM bookings b
        INNER JOIN users u ON b.user_id = u.id
        INNER JOIN vehicles v ON b.vehicle_id = v.id
        WHERE v.owner_id = ?
      `;
    } else if (userRole === 'hotel_owner') {
      query = `
        SELECT b.id, b.booking_type, b.start_date, b.end_date, 
               b.pickup_lat, b.pickup_lng, b.pickup_address,
               b.destination_lat, b.destination_lng, b.destination_address,
               b.total_price, b.status, b.cancellation_reason, b.created_at,
               h.name as hotel_name, h.city as hotel_city,
               u.name as traveler_name, u.email as traveler_email, u.phone as traveler_phone
        FROM bookings b
        INNER JOIN users u ON b.user_id = u.id
        INNER JOIN hotels h ON b.hotel_id = h.id
        WHERE h.user_id = ?
      `;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Invalid role'
      });
    }

    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC`;

    const [rows] = await pool.execute(query, params);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get business bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Accept booking (for business users)
const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Verify the booking belongs to this business user's resource
    let verifyQuery = '';
    if (userRole === 'driver') {
      verifyQuery = `
        SELECT b.id FROM bookings b
        INNER JOIN drivers d ON b.driver_id = d.id
        WHERE b.id = ? AND d.user_id = ? AND b.status = 'pending'
      `;
    } else if (userRole === 'tour_guide') {
      verifyQuery = `
        SELECT b.id FROM bookings b
        INNER JOIN tour_guides tg ON b.tour_guide_id = tg.id
        WHERE b.id = ? AND tg.user_id = ? AND b.status = 'pending'
      `;
    } else if (userRole === 'car_owner') {
      verifyQuery = `
        SELECT b.id FROM bookings b
        INNER JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.id = ? AND v.owner_id = ? AND b.status = 'pending'
      `;
    } else if (userRole === 'hotel_owner') {
      verifyQuery = `
        SELECT b.id FROM bookings b
        INNER JOIN hotels h ON b.hotel_id = h.id
        WHERE b.id = ? AND h.user_id = ? AND b.status = 'pending'
      `;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const [rows] = await pool.execute(verifyQuery, [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }

    // Update booking status to confirmed
    const updateQuery = 'UPDATE bookings SET status = "confirmed" WHERE id = ?';
    await pool.execute(updateQuery, [id]);

    res.status(200).json({
      success: true,
      message: 'Booking accepted successfully'
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reject booking with reason (for business users)
const rejectBooking = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { cancellation_reason } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (!cancellation_reason || cancellation_reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }

    // Verify the booking belongs to this business user's resource
    let verifyQuery = '';
    if (userRole === 'driver') {
      verifyQuery = `
        SELECT b.id, b.booking_type, b.hotel_id FROM bookings b
        INNER JOIN drivers d ON b.driver_id = d.id
        WHERE b.id = ? AND d.user_id = ? AND b.status = 'pending'
      `;
    } else if (userRole === 'tour_guide') {
      verifyQuery = `
        SELECT b.id, b.booking_type, b.hotel_id FROM bookings b
        INNER JOIN tour_guides tg ON b.tour_guide_id = tg.id
        WHERE b.id = ? AND tg.user_id = ? AND b.status = 'pending'
      `;
    } else if (userRole === 'car_owner') {
      verifyQuery = `
        SELECT b.id, b.booking_type, b.hotel_id FROM bookings b
        INNER JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.id = ? AND v.owner_id = ? AND b.status = 'pending'
      `;
    } else if (userRole === 'hotel_owner') {
      verifyQuery = `
        SELECT b.id, b.booking_type, b.hotel_id FROM bookings b
        INNER JOIN hotels h ON b.hotel_id = h.id
        WHERE b.id = ? AND h.user_id = ? AND b.status = 'pending'
      `;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const [rows] = await connection.execute(verifyQuery, [id, userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }

    const booking = rows[0];

    // Update booking status to cancelled with reason
    const updateQuery = 'UPDATE bookings SET status = "cancelled", cancellation_reason = ? WHERE id = ?';
    await connection.execute(updateQuery, [cancellation_reason, id]);

    // If it was a hotel booking, increase available rooms count
    if (booking.booking_type === 'hotel' && booking.hotel_id) {
      const updateHotelRoomsQuery = `
        UPDATE hotels 
        SET available_rooms = available_rooms + 1 
        WHERE id = ?
      `;
      await connection.execute(updateHotelRoomsQuery, [booking.hotel_id]);
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Booking rejected successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const query = `
      SELECT 
        b.*,
        u.name as user_name,
        u.email as user_email
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 500
    `;
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getBusinessBookings,
  acceptBooking,
  rejectBooking,
  getAllBookings
};