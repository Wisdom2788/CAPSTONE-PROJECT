/**
 * Test script to verify profile update endpoint
 */

const mongoose = require('mongoose');
const SimpleUser = require('./src/models/SimpleUser');

// Load environment variables
require('dotenv').config();

async function testProfileUpdate() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youthguard_dev');
        console.log('Connected to database');
        
        // Find the user we just created
        const user = await SimpleUser.findOne({ email: 'profile.test@example.com' });
        if (!user) {
            console.log('User not found');
            return;
        }
        
        console.log('Found user with ID:', user._id);
        
        // Test profile update endpoint
        const http = require('http');
        
        const updateData = JSON.stringify({
            firstName: 'Updated',
            lastName: 'Name',
            location: {
                state: 'Lagos',
                city: 'Victoria Island'
            }
        });
        
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/users/profile',
            method: 'PUT',
            headers: {
                'user-id': user._id.toString(),
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(updateData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Profile update response status:', res.statusCode);
                if (res.statusCode === 200) {
                    console.log('✅ Profile update endpoint working correctly!');
                    console.log('Response:', data);
                } else {
                    console.log('❌ Profile update endpoint failed:', data);
                }
                
                // Close database connection
                mongoose.connection.close();
            });
        });
        
        req.on('error', (error) => {
            console.error('Request error:', error.message);
            mongoose.connection.close();
        });
        
        req.write(updateData);
        req.end();
        
    } catch (error) {
        console.error('Error:', error.message);
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
}

testProfileUpdate();