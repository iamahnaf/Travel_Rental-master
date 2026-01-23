require('dotenv').config();
const { pool } = require('../config/db');

async function fixSchema() {
  console.log('=== Fixing Database Schema ===\n');

  const fixes = [
    // Users table
    {
      table: 'users',
      column: 'role',
      sql: "ALTER TABLE users ADD COLUMN role ENUM('traveler','driver','tour_guide','car_owner','hotel_owner','admin') DEFAULT 'traveler' AFTER phone"
    },
    // Hotels table
    {
      table: 'hotels',
      column: 'user_id',
      sql: 'ALTER TABLE hotels ADD COLUMN user_id INT NULL AFTER id'
    },
    // Drivers table
    {
      table: 'drivers',
      column: 'user_id',
      sql: 'ALTER TABLE drivers ADD COLUMN user_id INT NULL AFTER id'
    },
    // Tour guides table
    {
      table: 'tour_guides',
      column: 'user_id',
      sql: 'ALTER TABLE tour_guides ADD COLUMN user_id INT NULL AFTER id'
    },
    // Bookings table - destination columns
    {
      table: 'bookings',
      column: 'destination_lat',
      sql: 'ALTER TABLE bookings ADD COLUMN destination_lat DECIMAL(10,8) NULL AFTER pickup_address'
    },
    {
      table: 'bookings',
      column: 'destination_lng',
      sql: 'ALTER TABLE bookings ADD COLUMN destination_lng DECIMAL(11,8) NULL AFTER destination_lat'
    },
    {
      table: 'bookings',
      column: 'destination_address',
      sql: 'ALTER TABLE bookings ADD COLUMN destination_address VARCHAR(500) NULL AFTER destination_lng'
    },
    {
      table: 'bookings',
      column: 'cancellation_reason',
      sql: 'ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT NULL AFTER status'
    }
  ];

  for (const fix of fixes) {
    try {
      await pool.query(fix.sql);
      console.log(`✓ Added ${fix.column} to ${fix.table}`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`  ${fix.column} already exists in ${fix.table}`);
      } else {
        console.log(`✗ Error adding ${fix.column} to ${fix.table}: ${e.message}`);
      }
    }
  }

  // Create hotel_rooms table if missing
  console.log('\n--- Creating hotel_rooms table ---');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotel_rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hotel_id INT NOT NULL,
        room_type ENUM('Standard', 'Deluxe', 'Suite', 'Executive') NOT NULL,
        room_number VARCHAR(20) NOT NULL,
        hourly_rate DECIMAL(10, 2) NULL,
        daily_rate DECIMAL(10, 2) NOT NULL,
        max_occupancy INT DEFAULT 2,
        amenities JSON,
        available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ hotel_rooms table ready');
  } catch (e) {
    console.log(`✗ Error creating hotel_rooms: ${e.message}`);
  }

  // Create driving_licenses table if missing
  console.log('\n--- Creating driving_licenses table ---');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS driving_licenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ driving_licenses table ready');
  } catch (e) {
    console.log(`✗ Error creating driving_licenses: ${e.message}`);
  }

  // Create nid_cards table if missing
  console.log('\n--- Creating nid_cards table ---');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nid_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        number VARCHAR(20) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ nid_cards table ready');
  } catch (e) {
    console.log(`✗ Error creating nid_cards: ${e.message}`);
  }

  // Create promo_codes table if missing
  console.log('\n--- Creating promo_codes table ---');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type ENUM('percentage', 'fixed') NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        min_order_value DECIMAL(10, 2) DEFAULT 0,
        max_uses INT DEFAULT NULL,
        current_uses INT DEFAULT 0,
        valid_from DATE NOT NULL,
        valid_until DATE NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ promo_codes table ready');
  } catch (e) {
    console.log(`✗ Error creating promo_codes: ${e.message}`);
  }

  console.log('\n=== Schema fix complete! ===');
  await pool.end();
}

fixSchema().catch(console.error);
