#!/usr/bin/env node
require('dotenv').config();
const { pool } = require('./config/db');

async function testDriverUpdate() {
  try {
    console.log('🧪 Testing Driver Profile Update Functionality\n');
    
    // Test 1: Check drivers table structure
    console.log('Test 1: Checking drivers table structure...');
    const [columns] = await pool.execute('DESCRIBE drivers');
    const hasPhotoUrl = columns.some(col => col.Field === 'photo_url');
    const hasLicenseUrl = columns.some(col => col.Field === 'license_url');
    
    console.log(`  - photo_url column: ${hasPhotoUrl ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`  - license_url column: ${hasLicenseUrl ? '✅ EXISTS' : '⚠️  MISSING (will be nullable)'}`);
    
    // Test 2: Check if there are any drivers
    console.log('\nTest 2: Checking existing drivers...');
    const [drivers] = await pool.execute('SELECT id, name, user_id, photo_url FROM drivers LIMIT 3');
    console.log(`  - Found ${drivers.length} driver(s)`);
    drivers.forEach(d => {
      console.log(`    • Driver: ${d.name} (ID: ${d.id}, User ID: ${d.user_id})`);
      console.log(`      Photo: ${d.photo_url || 'No photo'}`);
    });
    
    // Test 3: Try to add license_url column if it doesn't exist
    if (!hasLicenseUrl) {
      console.log('\nTest 3: Adding license_url column...');
      try {
        await pool.execute('ALTER TABLE drivers ADD COLUMN license_url VARCHAR(500) AFTER photo_url');
        console.log('  ✅ license_url column added successfully');
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log('  ℹ️  license_url column already exists');
        } else {
          console.error('  ❌ Error adding column:', error.message);
        }
      }
    }
    
    // Test 4: Simulate a driver profile update
    if (drivers.length > 0) {
      console.log('\nTest 4: Simulating profile update...');
      const testDriver = drivers[0];
      
      const updateQuery = `
        UPDATE drivers SET 
          name = ?, 
          photo_url = ?, 
          ${hasLicenseUrl || true ? 'license_url = ?,' : ''}
          bio = ?
        WHERE id = ?
      `;
      
      const testPhoto = 'https://example.com/test-photo.jpg';
      const testLicense = 'https://example.com/test-license.jpg';
      const testBio = 'Updated bio - Test at ' + new Date().toISOString();
      
      const params = hasLicenseUrl || true
        ? [testDriver.name, testPhoto, testLicense, testBio, testDriver.id]
        : [testDriver.name, testPhoto, testBio, testDriver.id];
      
      await pool.execute(updateQuery, params);
      console.log(`  ✅ Successfully updated driver ${testDriver.name}`);
      
      // Verify the update
      const [updated] = await pool.execute('SELECT name, photo_url, bio FROM drivers WHERE id = ?', [testDriver.id]);
      if (hasLicenseUrl) {
        const [withLicense] = await pool.execute('SELECT license_url FROM drivers WHERE id = ?', [testDriver.id]);
        console.log(`  - Photo URL: ${updated[0].photo_url}`);
        console.log(`  - License URL: ${withLicense[0].license_url || 'NULL'}`);
      } else {
        console.log(`  - Photo URL: ${updated[0].photo_url}`);
      }
      console.log(`  - Bio updated: ${updated[0].bio.substring(0, 50)}...`);
    }
    
    console.log('\n✅ All tests completed!\n');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    await pool.end();
    process.exit(1);
  }
}

testDriverUpdate();
