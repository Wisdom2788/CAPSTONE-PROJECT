/**
 * Admin Middleware - YouthGuard Platform
 * 
 * This middleware verifies that the authenticated user has admin privileges.
 */

const logger = require('../utils/logger');

/**
 * Check if user has admin privileges
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function adminMiddleware(req, res, next) {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No user authenticated.'
            });
        }
        
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            logger.warn('Unauthorized admin access attempt', {
                userId: req.user._id,
                email: req.user.email,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        
        // Log successful admin access
        logger.info('Admin access granted', {
            userId: req.user._id,
            email: req.user.email,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        next();
    } catch (error) {
        logger.error('Admin middleware error', {
            error: error.message,
            stack: error.stack,
            userId: req.user ? req.user._id : 'unknown',
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        res.status(500).json({
            success: false,
            message: 'Admin access verification failed.'
        });
    }
}

module.exports = adminMiddleware;