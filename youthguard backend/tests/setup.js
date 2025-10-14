/**
 * Jest Setup File - YouthGuard Platform
 * 
 * This file runs before each test file to set up the testing environment.
 */

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.BCRYPT_SALT_ROUNDS = '10';

// Mock environment variables that might be needed
process.env.MONGODB_URI = 'mongodb://localhost:27017/youthguard_test';
process.env.PORT = '3001';
process.env.CORS_ORIGIN = 'http://localhost:3000';

// Mock console methods to reduce noise during testing
console.log = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Mock logger to prevent actual logging during tests
jest.mock('../src/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}));