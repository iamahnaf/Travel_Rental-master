const { pool } = require('../config/db');

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const query = `
      SELECT id, brand, model, year, fuel_type, transmission, seats, 
             price_per_day, with_driver_price, image_url, images, description, rating,
             available, default_fuel_included, created_at
      FROM vehicles
      WHERE available = 1
      ORDER BY rating DESC, created_at DESC
    `;
    const [rows] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get all vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, brand, model, year, fuel_type, transmission, seats, 
             price_per_day, with_driver_price, image_url, images, description, 
             available, default_fuel_included, created_at
      FROM vehicles
      WHERE id = ?
    `;
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get vehicle by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get available vehicles for booking
const getAvailableVehicles = async (req, res) => {
  try {
    const { startDate, endDate, withDriver } = req.query;

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

    // SQL query to find available vehicles
    const query = `
      SELECT v.id, v.brand, v.model, v.year, v.fuel_type, v.transmission, v.seats, 
             CASE 
               WHEN ? = 1 THEN v.with_driver_price
               ELSE v.price_per_day
             END AS price_per_day,
             v.with_driver_price, v.image_url, v.images, v.description, 
             v.available, v.default_fuel_included, v.created_at
      FROM vehicles v
      WHERE v.available = 1
        AND NOT EXISTS (
          SELECT 1
          FROM bookings b
          WHERE b.vehicle_id = v.id
            AND b.booking_type = 'vehicle'
            AND b.status != 'cancelled'
            AND (
              (DATE(?) BETWEEN b.start_date AND b.end_date) OR
              (DATE(?) BETWEEN b.start_date AND b.end_date) OR
              (DATE(?) <= b.start_date AND DATE(?) >= b.end_date)
            )
        )
    `;
    
    const [rows] = await pool.execute(query, [
      withDriver === 'true' ? 1 : 0,  // withDriver flag
      formattedStartDate,               // startDate
      formattedEndDate,                 // endDate
      formattedStartDate,               // startDate
      formattedEndDate                  // endDate
    ]);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get available vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get vehicles owned by the current user
const getOwnerVehicles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = `
      SELECT id, brand, model, year, fuel_type, transmission, seats, 
             price_per_day, with_driver_price, image_url, images, description, 
             available, default_fuel_included, created_at
      FROM vehicles
      WHERE owner_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query, [userId]);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get owner vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new vehicle
const createVehicle = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      brand, model, year, fuel_type, transmission, seats, 
      price_per_day, with_driver_price, image_url, description, 
      default_fuel_included 
    } = req.body;

    const query = `
      INSERT INTO vehicles (
        owner_id, brand, model, year, fuel_type, transmission, seats, 
        price_per_day, with_driver_price, image_url, description, 
        default_fuel_included
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      userId, brand, model, year, fuel_type, transmission, seats, 
      price_per_day, with_driver_price, image_url, description, 
      default_fuel_included ? 1 : 0
    ]);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { 
      brand, model, year, fuel_type, transmission, seats, 
      price_per_day, with_driver_price, image_url, description, 
      available, default_fuel_included 
    } = req.body;

    // Check ownership
    const checkQuery = 'SELECT id FROM vehicles WHERE id = ? AND owner_id = ?';
    const [rows] = await pool.execute(checkQuery, [id, userId]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or vehicle not found' });
    }

    const query = `
      UPDATE vehicles SET 
        brand = ?, model = ?, year = ?, fuel_type = ?, transmission = ?, 
        seats = ?, price_per_day = ?, with_driver_price = ?, 
        image_url = ?, description = ?, available = ?, 
        default_fuel_included = ?
      WHERE id = ?
    `;
    
    await pool.execute(query, [
      brand, model, year, fuel_type, transmission, seats, 
      price_per_day, with_driver_price, image_url, description, 
      available ? 1 : 0, default_fuel_included ? 1 : 0, id
    ]);

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully'
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check ownership
    const checkQuery = 'SELECT id FROM vehicles WHERE id = ? AND owner_id = ?';
    const [rows] = await pool.execute(checkQuery, [id, userId]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or vehicle not found' });
    }

    await pool.execute('DELETE FROM vehicles WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  getAvailableVehicles,
  getOwnerVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
};