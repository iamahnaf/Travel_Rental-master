const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { pool } = require('../config/db');

// Register a new user
const registerUser = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, password, phone, role, businessData } = req.body;

    // Validate role
    const validRoles = ['traveler', 'driver', 'tour_guide', 'car_owner', 'hotel_owner', 'admin'];
    const userRole = role && validRoles.includes(role) ? role : 'traveler';

    // Validate business data for business roles
    if (['driver', 'tour_guide', 'car_owner', 'hotel_owner'].includes(userRole) && !businessData) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Business data is required for this role'
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const query = `
      INSERT INTO users (name, email, password_hash, phone, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [name, email, hashedPassword, phone || null, userRole]);
    const userId = result.insertId;

    // If business user, create corresponding entity
    if (businessData) {
      if (userRole === 'driver') {
        const driverQuery = `
          INSERT INTO drivers (user_id, name, experience_years, city, price_per_day) 
          VALUES (?, ?, ?, ?, 1500)
        `;
        await connection.execute(driverQuery, [userId, name, businessData.experienceYears, businessData.city]);
      } else if (userRole === 'tour_guide') {
        const guideQuery = `
          INSERT INTO tour_guides (user_id, name, experience_years, city, specialties, price_per_day) 
          VALUES (?, ?, ?, ?, ?, 2000)
        `;
        const specialties = businessData.specialties.split(',').map(s => s.trim());
        await connection.execute(guideQuery, [userId, name, 0, businessData.city, JSON.stringify(specialties)]);
      } else if (userRole === 'hotel_owner') {
        const hotelQuery = `
          INSERT INTO hotels (user_id, name, city, location, price_per_night, available_rooms, total_rooms, image_urls, amenities) 
          VALUES (?, ?, ?, ?, 3500, 10, 10, '[]', '[]')
        `;
        await connection.execute(hotelQuery, [userId, businessData.businessName, businessData.city, businessData.address]);
      } else if (userRole === 'car_owner') {
        const vehicleQuery = `
          INSERT INTO vehicles (owner_id, brand, model, year, fuel_type, transmission, seats, price_per_day, with_driver_price) 
          VALUES (?, ?, ?, ?, 'Petrol', 'Automatic', 5, 2500, 3500)
        `;
        await connection.execute(vehicleQuery, [userId, businessData.carBrand, businessData.carModel, businessData.carYear]);
      }
    }

    await connection.commit();

    // Generate JWT token
    const token = generateToken({ userId, email, role: userRole });

    // Return success response with token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: userId,
        name,
        email,
        phone: phone || null,
        role: userRole,
        token
      }
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    connection.release();
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const query = 'SELECT id, name, email, password_hash, phone, role FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user details
    const query = `
      SELECT id, name, email, phone, role, created_at, updated_at 
      FROM users 
      WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's driving license status
    const licenseQuery = `
      SELECT id, file_path, status, uploaded_at, verified_at 
      FROM driving_licenses 
      WHERE user_id = ?
      ORDER BY uploaded_at DESC
      LIMIT 1
    `;
    const [licenseRows] = await pool.execute(licenseQuery, [userId]);
    
    const drivingLicense = licenseRows.length > 0 ? licenseRows[0] : null;

    // Get user's NID card status
    const nidQuery = `
      SELECT id, number, file_path, status, uploaded_at, verified_at 
      FROM nid_cards 
      WHERE user_id = ?
      ORDER BY uploaded_at DESC
      LIMIT 1
    `;
    const [nidRows] = await pool.execute(nidQuery, [userId]);
    
    const nidCard = nidRows.length > 0 ? nidRows[0] : null;

    res.status(200).json({
      success: true,
      data: {
        ...rows[0],
        drivingLicense,
        nidCard
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    // Update user details
    const query = `
      UPDATE users 
      SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await pool.execute(query, [name, phone, userId]);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const query = 'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC';
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers
};