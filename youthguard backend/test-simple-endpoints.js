/**
 * Simple test script to verify YouthGuard API endpoints
 */

const http = require('http');

// Test data
const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'SecurePass123',
    phoneNumber: '+2348123456789',
    dateOfBirth: '2000-01-01',
    gender: 'male',
    location: {
        state: 'Lagos',
        city: 'Ikeja'
    },
    userType: 'Youth'
};

console.log('Testing YouthGuard API endpoints...\n');

// Test health endpoint
console.log('1. Testing health endpoint...');
const healthReq = http.get('http://localhost:5000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('   Health check response:', data);
        
        // Test registration endpoint
        console.log('\n2. Testing user registration...');
        const postData = JSON.stringify(testUser);
        
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const regReq = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('   Registration response status:', res.statusCode);
                console.log('   Registration response:', data);
                
                console.log('\n✅ All tests completed!');
            });
        });
        
        regReq.on('error', (error) => {
            console.error('   Registration error:', error.message);
        });
        
        regReq.write(postData);
        regReq.end();
    });
});

healthReq.on('error', (error) => {
    console.error('   Health check error:', error.message);
});