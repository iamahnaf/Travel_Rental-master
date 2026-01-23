const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
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
        }).on('error', reject);
    });
}

async function testEndpoints() {
    const endpoints = [
        { name: 'Vehicles', url: `${BASE_URL}/vehicles` },
        { name: 'Hotels', url: `${BASE_URL}/hotels` },
        { name: 'Drivers', url: `${BASE_URL}/drivers` },
        { name: 'Tour Guides', url: `${BASE_URL}/tour-guides` },
        { name: 'Promos', url: `${BASE_URL}/promos` }
    ];

    console.log('--- Verifying Backend Content Endpoints ---');

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint.name}...`);
            const response = await fetchJson(endpoint.url);
            const data = await response.json();

            if (response.ok && data.success) {
                console.log(`✅ ${endpoint.name} Endpoint: OK`);
                console.log(`   Count: ${data.data ? data.data.length : 'N/A'}`);
            } else {
                console.error(`❌ ${endpoint.name} Endpoint: FAILED`);
                console.error(`   Status: ${response.status}`);
                console.error(`   Message: ${data.message || 'No message'}`);
            }
        } catch (error) {
            console.error(`❌ ${endpoint.name} Endpoint: ERROR`);
            console.error(`   Details: ${error.message}`);
        }
        console.log('-------------------------------------------');
    }
}

testEndpoints();
