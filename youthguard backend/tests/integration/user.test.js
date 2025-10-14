/**
 * User API Integration Tests - YouthGuard Platform
 * 
 * These tests verify the functionality of the user API endpoints.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const createApp = require('../../src/config/app');
const User = require('../../src/models/User');

describe('User API', () => {
    let app;
    let server;
    let testUser;
    let authToken;
    
    // Test user data
    const testUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+2348012345678',
        dateOfBirth: '2000-01-01',
        gender: 'male',
        location: {
            state: 'Lagos',
            city: 'Ikeja'
        },
        password: 'Password123!'
    };
    
    beforeAll(async () => {
        // Create app instance
        app = createApp();
        
        // Connect to test database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/youthguard_test';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Start server on a test port
        server = app.listen(process.env.PORT || 3001);
    });
    
    afterAll(async () => {
        // Close server
        if (server) {
            server.close();
        }
        
        // Clear test data and close database connection
        await User.deleteMany({});
        await mongoose.connection.close();
    });
    
    beforeEach(async () => {
        // Clear users collection before each test
        await User.deleteMany({});
    });
    
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUserData)
                .expect(201);
            
            expect(response.body).toEqual({
                success: true,
                message: 'User registered successfully. Please check your email for verification.',
                data: {
                    id: expect.any(String),
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    role: 'youth'
                }
            });
            
            // Verify user was created in database
            const user = await User.findOne({ email: 'john.doe@example.com' });
            expect(user).toBeTruthy();
            expect(user.firstName).toBe('John');
            expect(user.lastName).toBe('Doe');
            expect(user.email).toBe('john.doe@example.com');
            expect(await bcrypt.compare('Password123!', user.password)).toBe(true);
        });
        
        it('should return 400 for invalid registration data', async () => {
            const invalidData = {
                firstName: 'John',
                // Missing required fields
            };
            
            const response = await request(app)
                .post('/api/auth/register')
                .send(invalidData)
                .expect(400);
            
            expect(response.body).toEqual({
                success: false,
                message: 'Validation error',
                error: expect.any(String)
            });
        });
        
        it('should return 400 for duplicate email', async () => {
            // Create first user
            await request(app)
                .post('/api/auth/register')
                .send(testUserData);
            
            // Try to create user with same email
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUserData)
                .expect(400);
            
            expect(response.body).toEqual({
                success: false,
                message: 'Validation error',
                error: 'Email already exists'
            });
        });
    });
    
    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await request(app)
                .post('/api/auth/register')
                .send(testUserData);
        });
        
        it('should login user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    identifier: 'john.doe@example.com',
                    password: 'Password123!'
                })
                .expect(200);
            
            expect(response.body).toEqual({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: expect.any(String),
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john.doe@example.com',
                        role: 'youth',
                        profilePicture: undefined
                    },
                    token: expect.any(String)
                }
            });
            
            // Store token for future tests
            authToken = response.body.data.token;
        });
        
        it('should return 401 for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    identifier: 'john.doe@example.com',
                    password: 'WrongPassword'
                })
                .expect(401);
            
            expect(response.body).toEqual({
                success: false,
                message: 'Invalid credentials'
            });
        });
        
        it('should return 400 for missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    identifier: 'john.doe@example.com'
                    // Missing password
                })
                .expect(400);
            
            expect(response.body).toEqual({
                success: false,
                message: 'Validation error',
                error: 'Password is required'
            });
        });
    });
    
    describe('GET /api/users/profile', () => {
        beforeEach(async () => {
            // Create and login user
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    identifier: 'john.doe@example.com',
                    password: 'Password123!'
                });
            
            authToken = response.body.data.token;
        });
        
        it('should get user profile successfully', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            
            expect(response.body).toEqual({
                success: true,
                message: 'Profile retrieved successfully',
                data: {
                    id: expect.any(String),
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phoneNumber: '+2348012345678',
                    dateOfBirth: '2000-01-01T00:00:00.000Z',
                    gender: 'male',
                    location: {
                        state: 'Lagos',
                        city: 'Ikeja'
                    },
                    profilePicture: null,
                    bio: null,
                    userType: 'Youth',
                    isActive: true,
                    isEmailVerified: false,
                    isPhoneVerified: false,
                    accountStatus: 'pending_verification',
                    lastLogin: null,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    fullName: 'John Doe',
                    age: expect.any(Number)
                }
            });
        });
        
        it('should return 401 for unauthorized access', async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .expect(401);
            
            expect(response.body).toEqual({
                success: false,
                message: 'Access denied. No token provided.'
            });
        });
    });
});