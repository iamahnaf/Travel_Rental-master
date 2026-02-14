const { pool } = require('../config/db');

async function addVehicleImages() {
  try {
    console.log('Adding images column to vehicles table...');
    
    // Check if column already exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'car_rental_booking' 
      AND TABLE_NAME = 'vehicles' 
      AND COLUMN_NAME = 'images'
    `);

    if (columns.length > 0) {
      console.log('✓ images column already exists');
      return;
    }

    // Add images column
    await pool.execute(`
      ALTER TABLE vehicles 
      ADD COLUMN images JSON NULL AFTER image_url
    `);

    console.log('✓ images column added successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addVehicleImages();
