const http = require('http');

const BASE_URL = 'http://localhost:5000/api/auth';

function postJson(url, body) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(body);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        json: () => Promise.resolve(JSON.parse(data))
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function testLoginApi() {
    // We need a valid user. debug-login.js created 'login_test_...'
    // But we don't know the exact random email.
    // Let's rely on the fact that debug-login.js inserted a user. 
    // We will try to register a NEW user to be sure we have credentials.

    const testEmail = `api_test_${Date.now()}@example.com`;
    const testPassword = 'password123';

    console.log('--- Registering new user via API ---');
    try {
        const regRes = await postJson(`${BASE_URL}/register`, {
            name: 'API Tester',
            email: testEmail,
            password: testPassword,
            phone: '01711111111'
        });
        const regData = await regRes.json();
        console.log('Registration Response:', JSON.stringify(regData, null, 2));

        console.log('\n--- Logging in via API ---');
        const loginRes = await postJson(`${BASE_URL}/login`, {
            email: testEmail,
            password: testPassword
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', JSON.stringify(loginData, null, 2));

        console.log('\n--- Analysis ---');
        if (loginData.data) {
            console.log('Backend returns user data in "data" property.');
        } else if (loginData.user) {
            console.log('Backend returns user data in "user" property.');
        } else {
            console.log('Backend returns user data in unknown property.');
        }

    } catch (error) {
        console.error('API Test Error:', error);
    }
}

testLoginApi();
