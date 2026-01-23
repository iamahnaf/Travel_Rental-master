require('dotenv').config();
const { pool } = require('./config/db');

async function checkAdmin() {
  try {
    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE role = "admin"');
    console.log('Admin users:', users);
    
    if (users.length === 0) {
      console.log('\nNo admin found. Creating one...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.execute(
        'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', 'admin@travelren.com', hashedPassword, '01700000000', 'admin']
      );
      console.log('\n✅ Admin created!');
      console.log('Email: admin@travelren.com');
      console.log('Password: admin123');
    } else {
      console.log('\nAdmin already exists:');
      users.forEach(u => {
        console.log(`- Email: ${u.email}`);
      });
      console.log('\nDefault password (if created by this script): admin123');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdmin();
