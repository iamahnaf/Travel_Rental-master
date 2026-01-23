require('dotenv').config();
const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

async function testRegistration() {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('Database connected successfully.');
    connection.release();

    const testUser = {
      name: 'Test Debug User',
      email: 'testdebug_' + Date.now() + '@example.com',
      password: 'password123',
      phone: '01700000000'
    };

    console.log('Attempting to register user:', testUser.email);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testUser.password, saltRounds);

    const query = `
      INSERT INTO users (name, email, password_hash, phone) 
      VALUES (?, ?, ?, ?)
    `;
    
    console.log('Executing query...');
    const [result] = await pool.execute(query, [
      testUser.name, 
      testUser.email, 
      hashedPassword, 
      testUser.phone
    ]);

    console.log('Insert result:', result);

    if (result.insertId) {
      console.log('User inserted with ID:', result.insertId);
      
      // Verify insertion
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      if (rows.length > 0) {
        console.log('User successfully retrieved from DB:', rows[0].email);
      } else {
        console.error('User inserted but not found immediately after!');
      }
    } else {
      console.error('No insertId returned!');
    }

  } catch (error) {
    console.error('Debug script failed:', error);
  } finally {
    process.exit();
  }
}

testRegistration();
