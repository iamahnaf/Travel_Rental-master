const http = require('http');

function checkHealth() {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/health',
        method: 'GET',
        timeout: 2000
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.on('timeout', () => {
        console.error('request timed out');
        req.destroy();
    });

    req.end();
}

checkHealth();
