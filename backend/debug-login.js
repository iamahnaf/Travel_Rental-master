require('dotenv').config();
const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

async function testAuthFlow() {
    const testEmail = `login_test_${Date.now()}@example.com`;
    const testPassword = 'password123';

    try {
        console.log('--- 1. Registration ---');
        console.log(`Registering user: ${testEmail}`);

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(testPassword, saltRounds);

        // Insert
        const [regResult] = await pool.execute(
            'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
            ['Login Tester', testEmail, hashedPassword, '01711111111']
        );
        console.log('Registration successful, ID:', regResult.insertId);

        console.log('\n--- 2. Login (Backend Logic) ---');

        // Fetch user
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [testEmail]);
        if (rows.length === 0) {
            throw new Error('User not found after registration!');
        }
        const user = rows[0];
        console.log('User found in DB:', user.email);
        console.log('Stored Hash:', user.password_hash);

        // Compare
        console.log(`Attempting login with password: "${testPassword}"`);
        const isMatch = await bcrypt.compare(testPassword, user.password_hash);

        if (isMatch) {
            console.log('✅ SUCCESS: Password matches hash.');
        } else {
            console.error('❌ FAILURE: Password does NOT match hash.');
        }

        // Negative Test
        console.log('\n--- 3. Negative Login Test ---');
        const wrongPass = 'wrongpassword';
        console.log(`Attempting login with WRONG password: "${wrongPass}"`);
        const isMatchWrong = await bcrypt.compare(wrongPass, user.password_hash);

        if (!isMatchWrong) {
            console.log('✅ SUCCESS: Wrong password correctly rejected.');
        } else {
            console.error('❌ FAILURE: Wrong password was ACCEPTED (Security Risk!).');
        }

    } catch (error) {
        console.error('Auth Flow Error:', error);
    } finally {
        process.exit();
    }
}

testAuthFlow();
