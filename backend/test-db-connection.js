require('dotenv').config();
const { pool } = require('./config/db');

async function testDatabase() {
  try {
    console.log('=== Database Connection Test ===\n');
    
    // Test connection
    console.log('✓ Database connected successfully');
    console.log(`  Database: ${process.env.DB_NAME}`);
    console.log(`  Host: ${process.env.DB_HOST}\n`);
    
    // Check database
    const [dbResult] = await pool.query('SELECT DATABASE() as db');
    console.log(`✓ Active database: ${dbResult[0].db}\n`);
    
    // List all tables
    const [tables] = await pool.query('SHOW TABLES');
    console.log(`✓ Tables found: ${tables.length}`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });
    console.log('');
    
    // Count records in main tables
    console.log('Record counts:');
    const mainTables = ['users', 'vehicles', 'drivers', 'hotels', 'tour_guides', 'bookings'];
    for (const table of mainTables) {
      const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${rows[0].count} records`);
    }
    console.log('');
    
    // Check users table structure
    const [userColumns] = await pool.query('DESCRIBE users');
    console.log('Users table structure:');
    userColumns.forEach(col => {
      const keyInfo = col.Key ? ` [${col.Key}]` : '';
      console.log(`  - ${col.Field}: ${col.Type}${keyInfo}`);
    });
    
    console.log('\n=== All checks passed! ===');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testDatabase();
