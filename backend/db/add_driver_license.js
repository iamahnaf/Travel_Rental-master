require('dotenv').config();
const { pool } = require('../config/db');

async function addDriverLicenseColumn() {
  try {
    console.log('Checking and adding license_url column to drivers table...');
    
    // Check if column exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'car_rental_booking' 
        AND TABLE_NAME = 'drivers' 
        AND COLUMN_NAME = 'license_url'
    `);
    
    if (columns.length === 0) {
      // Add license_url column
      await pool.execute(`
        ALTER TABLE drivers 
        ADD COLUMN license_url VARCHAR(500) AFTER photo_url
      `);
      console.log('✅ Successfully added license_url column to drivers table');
    } else {
      console.log('ℹ️  license_url column already exists');
    }
    
    // Verify the change
    const [result] = await pool.execute('DESCRIBE drivers');
    console.log('\nDrivers table columns:');
    result.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addDriverLicenseColumn();
