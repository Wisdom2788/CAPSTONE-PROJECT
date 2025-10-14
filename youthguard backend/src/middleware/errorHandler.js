/**
 * Global Error Handler Middleware for YouthGuard MVP
 * 
 * This middleware catches all errors that occur in the application
 * and sends appropriate HTTP responses to clients.
 * 
 * Key Concepts Explained:
 * 1. Error Middleware: Special Express middleware with 4 parameters (err, req, res, next)
 * 2. Error Types: Different types of errors require different handling
 * 3. Error Responses: Consistent error response format for API consumers
 * 4. Security: Don't expose sensitive information in error messages
 * 5. Logging: Log all errors for debugging and monitoring
 */

const logger = require('../utils/logger');

/**
 * MongoDB/Mongoose Error Handler
 * 
 * Handles specific database-related errors and converts them
 * to user-friendly messages.
 * 
 * @param {Error} error - The error object
 * @returns {Object} Formatted error response
 */
function handleMongooseError(error) {
    let formattedError = {
        statusCode: 400,
        message: 'Database operation failed'
    };

    // Duplicate key error (E11000)
    if (error.code === 11000) {
        // Extract field name from error message
        const field = Object.keys(error.keyValue)[0];
        formattedError = {
            statusCode: 409,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
            field: field
        };
    }
    
    // Validation error
    else if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message,
            value: err.value
        }));
        
        formattedError = {
            statusCode: 400,
            message: 'Validation failed',
            errors: validationErrors
        };
    }
    
    // Cast error (invalid ObjectId, etc.)
    else if (error.name === 'CastError') {
        formattedError = {
            statusCode: 400,
            message: `Invalid ${error.path}: ${error.value}`,
            field: error.path
        };
    }
    
    // Document not found error
    else if (error.name === 'DocumentNotFoundError') {
        formattedError = {
            statusCode: 404,
            message: 'Resource not found'
        };
    }

    return formattedError;
}

/**
 * JWT Error Handler
 * 
 * Handles JSON Web Token related errors.
 * 
 * @param {Error} error - The JWT error object
 * @returns {Object} Formatted error response
 */
function handleJWTError(error) {
    let formattedError = {
        statusCode: 401,
        message: 'Authentication failed'
    };

    if (error.name === 'JsonWebTokenError') {
        formattedError.message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
        formattedError.message = 'Token has expired';
    } else if (error.name === 'NotBeforeError') {
        formattedError.message = 'Token not active yet';
    }

    return formattedError;
}

/**
 * Validation Error Handler
 * 
 * Handles express-validator errors.
 * 
 * @param {Array} errors - Array of validation errors
 * @returns {Object} Formatted error response
 */
function handleValidationErrors(errors) {
    return {
        statusCode: 400,
        message: 'Validation failed',
        errors: errors.map(error => ({
            field: error.param,
            message: error.msg,
            value: error.value,
            location: error.location
        }))
    };
}

/**
 * Main Error Handler Middleware
 * 
 * This is the global error handler that processes all errors
 * in the application and sends appropriate responses.
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
    // Default error response
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    /**
     * Handle specific error types
     * 
     * Different errors need different handling to provide
     * meaningful responses to API consumers.
     */
    
    // Mongoose/MongoDB errors
    if (err.name === 'ValidationError' || 
        err.name === 'CastError' || 
        err.name === 'DocumentNotFoundError' || 
        err.code === 11000) {
        error = handleMongooseError(err);
    }
    
    // JWT errors
    else if (err.name === 'JsonWebTokenError' || 
             err.name === 'TokenExpiredError' || 
             err.name === 'NotBeforeError') {
        error = handleJWTError(err);
    }
    
    // Express-validator errors
    else if (err.array && typeof err.array === 'function') {
        error = handleValidationErrors(err.array());
    }
    
    // Multer file upload errors
    else if (err.code === 'LIMIT_FILE_SIZE') {
        error = {
            statusCode: 400,
            message: 'File too large',
            maxSize: '5MB'
        };
    } else if (err.code === 'LIMIT_FILE_COUNT') {
        error = {
            statusCode: 400,
            message: 'Too many files uploaded'
        };
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = {
            statusCode: 400,
            message: 'Unexpected file field'
        };
    }
    
    // Syntax errors (malformed JSON, etc.)
    else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        error = {
            statusCode: 400,
            message: 'Invalid JSON in request body'
        };
    }
    
    // Rate limiting errors
    else if (err.status === 429) {
        error = {
            statusCode: 429,
            message: 'Too many requests, please try again later'
        };
    }

    /**
     * Log the error for debugging and monitoring
     * 
     * Include relevant context to help with debugging:
     * - Request method and URL
     * - User information (if available)
     * - Request body (excluding sensitive data)
     * - Error stack trace
     */
    const logContext = {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || 'anonymous',
        statusCode: error.statusCode,
        // Include request body for debugging (exclude sensitive fields)
        requestBody: req.body ? sanitizeRequestBody(req.body) : undefined
    };

    // Log based on error severity
    if (error.statusCode >= 500) {
        // Server errors - these need immediate attention
        logger.error('Server Error', {
            error: err.message,
            stack: err.stack,
            ...logContext
        });
    } else if (error.statusCode >= 400) {
        // Client errors - log as warnings
        logger.warn('Client Error', {
            error: err.message,
            ...logContext
        });
    }

    /**
     * Security: Don't expose sensitive information in production
     * 
     * In production, we should hide:
     * - Stack traces
     * - Internal error details
     * - Database schema information
     * - File system paths
     */
    if (process.env.NODE_ENV === 'production') {
        // Remove stack trace
        delete error.stack;
        
        // Generic message for 500 errors
        if (error.statusCode >= 500) {
            error.message = 'Internal Server Error';
        }
    }

    /**
     * Send error response
     * 
     * Consistent error response format:
     * {
     *   \"success\": false,
     *   \"error\": {
     *     \"message\": \"Error description\",
     *     \"statusCode\": 400,
     *     \"errors\": [...] // For validation errors
     *   }
     * }
     */
    res.status(error.statusCode).json({
        success: false,
        error: {
            message: error.message,
            statusCode: error.statusCode,
            ...(error.errors && { errors: error.errors }),
            ...(error.field && { field: error.field }),
            ...(process.env.NODE_ENV === 'development' && error.stack && { stack: error.stack })
        }
    });
}

/**
 * Sanitize Request Body for Logging
 * 
 * Remove sensitive information from request body before logging.
 * 
 * @param {Object} body - Request body object
 * @returns {Object} Sanitized body object
 */
function sanitizeRequestBody(body) {
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'secret', 'key'];
    const sanitized = { ...body };
    
    // Remove sensitive fields
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });
    
    return sanitized;
}

/**
 * Async Error Handler Wrapper
 * 
 * Wraps async route handlers to catch errors and pass them to error middleware.
 * This prevents unhandled promise rejections.
 * 
 * Usage:
 * app.get('/route', asyncHandler(async (req, res) => {
 *   // Your async code here
 * }));
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    errorHandler,
    asyncHandler,
    handleMongooseError,
    handleJWTError,
    handleValidationErrors
};