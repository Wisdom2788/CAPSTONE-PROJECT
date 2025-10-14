/**
 * Final test script to verify all YouthGuard simple API endpoints
 */

const http = require('http');

console.log('🧪 Testing YouthGuard Simple API endpoints...\n');

// Generate unique email for testing
const timestamp = Date.now();
const testUser = {
    firstName: 'Alice',
    lastName: 'Wonderland',
    email: `alice.wonderland.${timestamp}@example.com`,
    password: 'SecurePass123!',
    phoneNumber: '+2348123456783',
    dateOfBirth: '2008-03-20',
    gender: 'female',
    location: {
        state: 'Oyo',
        city: 'Ibadan'
    }
};

// Test health endpoint
console.log('1. Testing health endpoint...');
const healthReq = http.get('http://localhost:5000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('   ✅ Health check response:', data);
        
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
                console.log('   ✅ Registration response status:', res.statusCode);
                if (res.statusCode === 201) {
                    console.log('   ✅ User registered successfully!');
                    
                    // Test login endpoint
                    console.log('\n3. Testing user login...');
                    const loginData = JSON.stringify({
                        email: testUser.email,
                        password: testUser.password
                    });
                    
                    const loginOptions = {
                        hostname: 'localhost',
                        port: 5000,
                        path: '/api/auth/login',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(loginData)
                        }
                    };
                    
                    const loginReq = http.request(loginOptions, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => {
                            console.log('   ✅ Login response status:', res.statusCode);
                            if (res.statusCode === 200) {
                                console.log('   ✅ User logged in successfully!');
                                const response = JSON.parse(data);
                                console.log('   🎯 JWT Token received:', response.data.token ? 'Yes' : 'No');
                                console.log('\n🎉 All tests completed successfully!');
                                console.log('🚀 The YouthGuard simple backend is working correctly!');
                            } else {
                                console.log('   ❌ Login failed:', data);
                            }
                        });
                    });
                    
                    loginReq.on('error', (error) => {
                        console.error('   ❌ Login error:', error.message);
                    });
                    
                    loginReq.write(loginData);
                    loginReq.end();
                } else {
                    console.log('   ❌ Registration failed:', data);
                }
            });
        });
        
        regReq.on('error', (error) => {
            console.error('   ❌ Registration error:', error.message);
        });
        
        regReq.write(postData);
        regReq.end();
    });
});

healthReq.on('error', (error) => {
    console.error('   ❌ Health check error:', error.message);
});