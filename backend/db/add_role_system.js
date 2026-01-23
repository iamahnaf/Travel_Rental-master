const mysql = require('mysql2/promise');
require('dotenv').config();

async function addRoleSystem() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'car_rental_booking',
      port: process.env.DB_PORT || 3307,
    });

    console.log('Connected to database');

    // Check if role column already exists
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM users LIKE 'role'"
    );

    if (columns.length === 0) {
      console.log('Adding role column to users table...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('traveler', 'driver', 'tour_guide', 'car_owner', 'admin') 
        DEFAULT 'traveler' 
        AFTER phone
      `);
      console.log('✓ Role column added to users table');
    } else {
      console.log('✓ Role column already exists in users table');
    }

    // Check and add owner_id to vehicles table
    const [vehicleColumns] = await connection.execute(
      "SHOW COLUMNS FROM vehicles LIKE 'owner_id'"
    );

    if (vehicleColumns.length === 0) {
      console.log('Adding owner_id column to vehicles table...');
      await connection.execute(`
        ALTER TABLE vehicles 
        ADD COLUMN owner_id INT NULL AFTER id,
        ADD FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('✓ Owner_id column added to vehicles table');
    } else {
      console.log('✓ Owner_id column already exists in vehicles table');
    }

    // Check and add user_id to drivers table
    const [driverColumns] = await connection.execute(
      "SHOW COLUMNS FROM drivers LIKE 'user_id'"
    );

    if (driverColumns.length === 0) {
      console.log('Adding user_id column to drivers table...');
      await connection.execute(`
        ALTER TABLE drivers 
        ADD COLUMN user_id INT NULL AFTER id,
        ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('✓ User_id column added to drivers table');
    } else {
      console.log('✓ User_id column already exists in drivers table');
    }

    // Check and add user_id to tour_guides table
    const [tourGuideColumns] = await connection.execute(
      "SHOW COLUMNS FROM tour_guides LIKE 'user_id'"
    );

    if (tourGuideColumns.length === 0) {
      console.log('Adding user_id column to tour_guides table...');
      await connection.execute(`
        ALTER TABLE tour_guides 
        ADD COLUMN user_id INT NULL AFTER id,
        ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('✓ User_id column added to tour_guides table');
    } else {
      console.log('✓ User_id column already exists in tour_guides table');
    }

    console.log('\n✅ Role system migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Users can now register with different roles');
    console.log('2. Drivers, tour guides, and car owners will have linked accounts');
    console.log('3. Role-based dashboards will show relevant data');

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
addRoleSystem();
