/**
 * Test script showing correct profile endpoint usage
 */

const http = require('http');

async function testCorrectProfileUsage() {
    console.log('Testing correct profile endpoint usage...\n');
    
    // Step 1: Register a test user
    console.log('1. Registering a test user...');
    const registerData = JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test.profile@example.com',
        password: 'password123',
        role: 'youth'
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
    
    return new Promise((resolve, reject) => {
        const registerReq = http.request(registerOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 201) {
                    const response = JSON.parse(data);
                    console.log('✅ User registered successfully');
                    console.log('User ID:', response.data.user._id);
                    
                    // Step 2: Test profile endpoint with correct format
                    testProfileEndpoint(response.data.user._id);
                } else {
                    console.log('Registration response:', data);
                    // Try to get existing user instead
                    testWithMockId();
                }
            });
        });
        
        registerReq.on('error', (error) => {
            console.error('Registration error:', error.message);
            testWithMockId();
        });
        
        registerReq.write(registerData);
        registerReq.end();
    });
}

function testProfileEndpoint(userId) {
    console.log('\n2. Testing profile endpoint with correct format...');
    
    const profileOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/users/profile',  // Correct URL format
        method: 'GET',
        headers: {
            'user-id': userId  // Correct header format
        }
    };
    
    const profileReq = http.request(profileOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Profile endpoint response status:', res.statusCode);
            if (res.statusCode === 200) {
                console.log('✅ Profile endpoint working correctly!');
                const response = JSON.parse(data);
                console.log('User profile:', {
                    id: response.data._id,
                    name: `${response.data.firstName} ${response.data.lastName}`,
                    email: response.data.email,
                    role: response.data.role
                });
            } else {
                console.log('❌ Profile endpoint failed:', data);
            }
            
            // Step 3: Show what the frontend is doing wrong
            showWrongUsage();
        });
    });
    
    profileReq.on('error', (error) => {
        console.error('Profile request error:', error.message);
        showWrongUsage();
    });
    
    profileReq.end();
}

function showWrongUsage() {
    console.log('\n3. Demonstrating what the frontend is doing wrong...');
    
    // This is what the frontend is currently doing (WRONG)
    const wrongOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/users/profile:1',  // WRONG: Adding :1 to the URL
        method: 'GET'
        // WRONG: No user-id header
    };
    
    const wrongReq = http.request(wrongOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Wrong URL response status:', res.statusCode);
            console.log('❌ This is why the frontend gets 404:', data);
            
            console.log('\n📋 SUMMARY:');
            console.log('✅ CORRECT: GET /api/users/profile with user-id header');
            console.log('❌ WRONG:   GET /api/users/profile:1 without headers');
            console.log('\n🔧 FRONTEND FIX NEEDED:');
            console.log('1. Change URL from "/api/users/profile:1" to "/api/users/profile"');
            console.log('2. Add header: { "user-id": "actual-user-id-from-login" }');
        });
    });
    
    wrongReq.on('error', (error) => {
        console.error('Wrong request error:', error.message);
    });
    
    wrongReq.end();
}

function testWithMockId() {
    console.log('Using mock ID for testing...');
    testProfileEndpoint('mock-user-id');
}

// Run the test
testCorrectProfileUsage();