/**
 * Simple User Controller - YouthGuard Platform
 * 
 * This controller handles all HTTP requests related to User management.
 * It follows a clean layered architecture with direct service instantiation.
 */

const SimpleUserService = require('../services/SimpleUserService');

class SimpleUserController {
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * Register a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async register(req, res) {
        try {
            const user = await this.userService.register(req.body);
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Authenticate user (login)
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const authResult = await this.userService.login(email, password);
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: authResult
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get current user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getProfile(req, res) {
        try {
            // In a real app, you would get user ID from JWT token
            // For simplicity, we'll use a mock user ID
            const userId = req.headers['user-id'] || 'mock-user-id';
            
            const user = await this.userService.findById(userId);
            
            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateProfile(req, res) {
        try {
            // In a real app, you would get user ID from JWT token
            // For simplicity, we'll use a mock user ID
            const userId = req.headers['user-id'] || 'mock-user-id';
            
            const user = await this.userService.updateProfile(userId, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = SimpleUserController;