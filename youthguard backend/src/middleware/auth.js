/**
 * Authentication Middleware - YouthGuard Platform
 * 
 * This middleware verifies JWT tokens and authenticates users for protected routes.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Authenticate user using JWT token
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function authMiddleware(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        // Check if token exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        
        // Check if token has Bearer prefix
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Use Bearer token.'
            });
        }
        
        // Extract token
        const token = authHeader.substring(7);
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }
        
        // Check if account is active
        if (user.account.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is not active.'
            });
        }
        
        // Attach user to request
        req.user = user;
        
        // Log successful authentication
        logger.info('User authenticated successfully', {
            userId: user._id,
            email: user.email,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        next();
    } catch (error) {
        logger.error('Authentication error', {
            error: error.message,
            stack: error.stack,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired.'
            });
        }
        
        // Generic error response
        res.status(500).json({
            success: false,
            message: 'Authentication failed.'
        });
    }
}

module.exports = authMiddleware;