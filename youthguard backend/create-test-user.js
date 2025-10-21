/**
 * Create a test user for profile testing
 */

const http = require('http');

async function createTestUser() {
    console.log('Creating a complete test user...\n');
    
    const registerData = JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: `test.user.${Date.now()}@example.com`,
        password: 'password123',
        role: 'youth',
        phoneNumber: '+2348012345678',
        dateOfBirth: '1995-06-15',
        gender: 'male',
        location: {
            city: 'Lagos',
            state: 'Lagos'
        }
    });
    
    const registerOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(registerData)
        }
    };
    
    const registerReq = http.request(registerOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Registration response status:', res.statusCode);
            if (res.statusCode === 201) {
                const response = JSON.parse(data);
                console.log('✅ User created successfully!');
                console.log('Full response:', JSON.stringify(response, null, 2));
                
                // Extract user ID from response structure
                const userId = response.data._id || response.data.user?._id;
                if (userId) {
                    console.log('User ID:', userId);
                    testProfileWithRealUser(userId);
                } else {
                    console.log('Could not find user ID in response');
                }
            } else {
                console.log('Registration failed:', data);
            }
        });
    });
    
    registerReq.on('error', (error) => {
        console.error('Registration error:', error.message);
    });
    
    registerReq.write(registerData);
    registerReq.end();
}

function testProfileWithRealUser(userId) {
    console.log('\nTesting profile endpoint with real user...');
    
    const profileOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/users/profile',
        method: 'GET',
        headers: {
            'user-id': userId
        }
    };
    
    const profileReq = http.request(profileOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Profile response status:', res.statusCode);
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                console.log('✅ Profile retrieved successfully!');
                console.log('Profile data:', {
                    id: response.data._id,
                    name: `${response.data.firstName} ${response.data.lastName}`,
                    email: response.data.email,
                    role: response.data.role,
                    location: response.data.location
                });
                
                console.log('\n🎯 FRONTEND SOLUTION:');
                console.log('The frontend should make this exact request:');
                console.log(`GET http://localhost:5000/api/users/profile`);
                console.log(`Headers: { "user-id": "${userId}" }`);
            } else {
                console.log('❌ Profile failed:', data);
            }
        });
    });
    
    profileReq.on('error', (error) => {
        console.error('Profile error:', error.message);
    });
    
    profileReq.end();
}

createTestUser();