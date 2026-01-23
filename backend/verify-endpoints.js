const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    const endpoints = [
        { name: 'Vehicles', url: `${BASE_URL}/vehicles` },
        { name: 'Hotels', url: `${BASE_URL}/hotels` },
        { name: 'Drivers', url: `${BASE_URL}/drivers` },
        { name: 'Tour Guides', url: `${BASE_URL}/tour-guides` }
    ];

    console.log('--- Verifying Backend Content Endpoints ---');

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint.name}...`);
            const response = await fetch(endpoint.url);
            const data = await response.json();

            if (response.ok && data.success) {
                console.log(`✅ ${endpoint.name} Endpoint: OK`);
                console.log(`   Count: ${data.data ? data.data.length : 'N/A'}`);
            } else {
                console.error(`❌ ${endpoint.name} Endpoint: FAILED`);
                console.error(`   Status: ${response.status}`);
                console.error(`   Message: ${data.message}`);
            }
        } catch (error) {
            console.error(`❌ ${endpoint.name} Endpoint: ERROR`);
            console.error(`   Details: ${error.message}`);
        }
        console.log('-------------------------------------------');
    }
}

testEndpoints();
