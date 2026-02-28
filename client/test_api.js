const http = require('http');

const data = JSON.stringify({
    username: "testuser_" + Date.now(),
    password: "password123",
    role: "CUSTOMER"
});

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
