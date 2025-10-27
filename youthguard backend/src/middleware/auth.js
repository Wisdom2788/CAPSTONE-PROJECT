/**
 * Authentication Middleware - YouthGuard Platform
 * 
 * This middleware verifies JWT tokens and authenticates users for protected routes.
 */

const jwt = require('jsonwebtoken');
const SimpleUser = require('../models/SimpleUser');

/**
 * Authenticate user using JWT token
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function authMiddleware(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');
        const userId = req.header('user-id');
        
        // Check if token exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'No token provided'
            });
        }
        
        // Check if user-id header exists
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'user-id header is required'
            });
        }
        
        // Check if token has Bearer prefix
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Invalid token format. Use Bearer token'
            });
        }
        
        // Extract token
        const token = authHeader.substring(7);
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'youthguard_jwt_secret');
        
        // Verify that token belongs to the user specified in user-id header
        if (decoded.id !== userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Token does not match user-id'
            });
        }
        
        // Find user
        const user = await SimpleUser.findById(decoded.id).select('-password');
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Invalid or expired token'
            });
        }
        
        // Check if account is active
        if (user.accountStatus !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Account is not active'
            });
        }
        
        // Attach user to request
        req.user = user;
        req.userId = userId;
        
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Invalid or expired token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Invalid or expired token'
            });
        }
        
        // Generic error response
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: 'Authentication service unavailable'
        });
    }
}

module.exports = authMiddleware;