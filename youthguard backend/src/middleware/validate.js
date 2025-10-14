/**
 * Validation Middleware - YouthGuard Platform
 * 
 * This middleware validates request data using express-validator.
 */

const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Handle validation errors
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function validateMiddleware(req, res, next) {
    try {
        // Get validation errors
        const errors = validationResult(req);
        
        // Check if there are validation errors
        if (!errors.isEmpty()) {
            logger.warn('Validation errors', {
                errors: errors.array(),
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }
        
        next();
    } catch (error) {
        logger.error('Validation middleware error', {
            error: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        res.status(500).json({
            success: false,
            message: 'Validation failed.'
        });
    }
}

module.exports = validateMiddleware;