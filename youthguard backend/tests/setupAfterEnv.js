/**
 * Jest Setup After Environment File - YouthGuard Platform
 * 
 * This file runs after the test environment has been set up.
 */

// Extend Jest expect with custom matchers
require('jest-extended');

// Set up global test utilities
global.testData = {
    // Sample user data for testing
    user: {
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
    },
    
    // Sample course data for testing
    course: {
        title: 'Introduction to Cybersecurity',
        description: 'Learn the fundamentals of cybersecurity',
        category: 'Technology',
        instructor: 'Jane Smith',
        duration: 40,
        level: 'beginner',
        price: 0
    }
};