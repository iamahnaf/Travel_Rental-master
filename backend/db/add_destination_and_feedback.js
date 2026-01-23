const mysql = require('mysql2/promise');
require('dotenv').config();

async function addDestinationAndFeedback() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'car_rental_booking',
      port: process.env.DB_PORT || 3307,
    });

    console.log('Connected to database');

    // Add hotel_owner to user role enum
    console.log('Updating user role enum to include hotel_owner...');
    await connection.execute(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('traveler', 'driver', 'tour_guide', 'car_owner', 'hotel_owner', 'admin') 
      DEFAULT 'traveler'
    `);
    console.log('✓ User role enum updated');

    // Add user_id to hotels table
    const [hotelColumns] = await connection.execute(
      "SHOW COLUMNS FROM hotels LIKE 'user_id'"
    );

    if (hotelColumns.length === 0) {
      console.log('Adding user_id column to hotels table...');
      await connection.execute(`
        ALTER TABLE hotels 
        ADD COLUMN user_id INT NULL AFTER id,
        ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('✓ User_id column added to hotels table');
    } else {
      console.log('✓ User_id column already exists in hotels table');
    }

    // Add destination fields to bookings table
    const [destLatColumns] = await connection.execute(
      "SHOW COLUMNS FROM bookings LIKE 'destination_lat'"
    );

    if (destLatColumns.length === 0) {
      console.log('Adding destination fields to bookings table...');
      await connection.execute(`
        ALTER TABLE bookings 
        ADD COLUMN destination_lat DECIMAL(10, 8) NULL AFTER pickup_address,
        ADD COLUMN destination_lng DECIMAL(11, 8) NULL AFTER destination_lat,
        ADD COLUMN destination_address VARCHAR(500) NULL AFTER destination_lng
      `);
      console.log('✓ Destination fields added to bookings table');
    } else {
      console.log('✓ Destination fields already exist in bookings table');
    }

    // Add cancellation_reason to bookings table
    const [cancelColumns] = await connection.execute(
      "SHOW COLUMNS FROM bookings LIKE 'cancellation_reason'"
    );

    if (cancelColumns.length === 0) {
      console.log('Adding cancellation_reason to bookings table...');
      await connection.execute(`
        ALTER TABLE bookings 
        ADD COLUMN cancellation_reason TEXT NULL AFTER status
      `);
      console.log('✓ Cancellation_reason field added to bookings table');
    } else {
      console.log('✓ Cancellation_reason field already exists in bookings table');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nChanges made:');
    console.log('1. Added hotel_owner role to users table');
    console.log('2. Linked hotels to users (user_id foreign key)');
    console.log('3. Added destination location fields (lat, lng, address)');
    console.log('4. Added cancellation_reason for rejected bookings');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run migration
addDestinationAndFeedback();
