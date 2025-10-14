/**
 * Simple User Service - YouthGuard Platform
 * 
 * This is a simplified version of the user service focusing on core functionality:
 * - User registration and authentication
 * - Profile management
 * - Basic validation
 */

const SimpleUser = require('../models/SimpleUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class SimpleUserService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registered user
     */
    async register(userData) {
        try {
            // Check if user already exists
            const existingUser = await SimpleUser.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Create user
            const user = new SimpleUser({
                ...userData,
                accountStatus: 'active' // Set to active for simplicity
            });

            const savedUser = await user.save();
            
            // Remove sensitive data before returning
            return savedUser.toJSON();
        } catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    /**
     * Authenticate user
     * @param {String} email - User email
     * @param {String} password - User password
     * @returns {Promise<Object>} Authentication result with token
     */
    async login(email, password) {
        try {
            // Find user by email
            const user = await SimpleUser.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check if account is active
            if (user.accountStatus !== 'active' && user.accountStatus !== 'pending') {
                throw new Error('Account is not active');
            }

            // Compare passwords
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Generate JWT token
            const token = user.generateAuthToken();

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            return {
                user: user.toJSON(),
                token
            };
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    /**
     * Get user by ID
     * @param {String} userId - User ID
     * @returns {Promise<Object>} User data
     */
    async findById(userId) {
        try {
            const user = await SimpleUser.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            return user.toJSON();
        } catch (error) {
            throw new Error(`User not found: ${error.message}`);
        }
    }

    /**
     * Update user profile
     * @param {String} userId - User ID
     * @param {Object} profileData - Profile update data
     * @returns {Promise<Object>} Updated user
     */
    async updateProfile(userId, profileData) {
        try {
            // Remove sensitive fields from update data
            const { password, email, ...updateData } = profileData;
            
            const user = await SimpleUser.findByIdAndUpdate(
                userId, 
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!user) {
                throw new Error('User not found');
            }
            
            return user.toJSON();
        } catch (error) {
            throw new Error(`Profile update failed: ${error.message}`);
        }
    }
}

module.exports = SimpleUserService;