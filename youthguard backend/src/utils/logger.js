/**
 * Logger Utility for YouthGuard MVP
 * 
 * This file sets up Winston logger for comprehensive application logging.
 * 
 * Key Concepts Explained:
 * 1. Winston: A multi-transport async logging library for Node.js
 * 2. Log Levels: Different severity levels (error, warn, info, debug)
 * 3. Transports: Where logs are stored (console, file, database)
 * 4. Formatters: How log messages are structured and displayed
 * 5. Log Rotation: Prevents log files from growing too large
 */

// Import required modules
const winston = require('winston');
const path = require('path');
const fs = require('fs');

/**
 * Ensure logs directory exists
 * 
 * This creates the logs directory if it doesn't exist.
 * Important for file logging to work properly.
 */
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Custom log format configuration
 * 
 * This defines how log messages will be structured and displayed.
 * Components explained:
 * - timestamp: When the log occurred
 * - level: Severity level (error, warn, info, debug)
 * - message: The actual log message
 * - metadata: Additional context data
 */
const logFormat = winston.format.combine(
    // Add timestamp to each log
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    
    // Add error stack traces when logging errors
    winston.format.errors({ stack: true }),
    
    // Convert log objects to JSON for structured logging
    winston.format.json(),
    
    // Custom formatting for readability
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        // Create base log message
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        // Add metadata if present
        if (Object.keys(metadata).length > 0) {
            log += ` | Metadata: ${JSON.stringify(metadata)}`;
        }
        
        return log;
    })
);

/**
 * Console format for development
 * 
 * This creates colorized, easy-to-read logs for development.
 * Different colors for different log levels help with debugging.
 */
const consoleFormat = winston.format.combine(
    winston.format.colorize(), // Add colors
    winston.format.simple()    // Simple text format
);

/**
 * Logger Configuration
 * 
 * This creates the main logger instance with multiple transports.
 * 
 * Log Levels (in order of severity):
 * - error: Application errors, exceptions
 * - warn: Warning messages, deprecated usage
 * - info: General information, application flow
 * - debug: Detailed debugging information
 */
const logger = winston.createLogger({
    // Default log level (can be overridden by environment variable)
    level: process.env.LOG_LEVEL || 'info',
    
    // Use our custom format
    format: logFormat,
    
    // Define where logs should be written
    transports: [
        /**
         * Error Log File Transport
         * 
         * This writes only error-level logs to a separate file.
         * Benefits:
         * - Easy to find critical issues
         * - Separate error monitoring
         * - Error-specific log rotation
         */
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB max file size
            maxFiles: 5,      // Keep 5 old files
            tailable: true    // Keep writing to same file name
        }),
        
        /**
         * Combined Log File Transport
         * 
         * This writes all logs to a general application log file.
         * Benefits:
         * - Complete application history
         * - Debugging and monitoring
         * - Audit trail
         */
        new winston.transports.File({
            filename: path.join(logsDir, 'app.log'),
            maxsize: 5242880, // 5MB max file size
            maxFiles: 10,     // Keep 10 old files
            tailable: true
        })
    ],
    
    /**
     * Exception Handlers
     * 
     * These handle uncaught exceptions and unhandled promise rejections.
     * Important for:
     * - Preventing application crashes from going unnoticed
     * - Debugging production issues
     * - Maintaining application stability
     */
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, 'exceptions.log')
        })
    ],
    
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logsDir, 'rejections.log')
        })
    ]
});

/**
 * Development Console Logging
 * 
 * In development mode, also log to console with colors for better readability.
 * This is only added in non-production environments to avoid cluttering
 * production logs with console output.
 */
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

/**
 * Enhanced Logger Methods
 * 
 * These methods provide convenient ways to log with context.
 * They automatically include useful metadata like timestamps,
 * request IDs, user information, etc.
 */

/**
 * Log API requests
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} responseTime - Request processing time in ms
 */
logger.logRequest = (req, res, responseTime) => {
    const logData = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || 'anonymous'
    };
    
    // Log as info for successful requests, warn for client errors, error for server errors
    if (res.statusCode >= 500) {
        logger.error('API Request', logData);
    } else if (res.statusCode >= 400) {
        logger.warn('API Request', logData);
    } else {
        logger.info('API Request', logData);
    }
};

/**
 * Log database operations
 * 
 * @param {string} operation - Type of database operation
 * @param {string} collection - Database collection name
 * @param {Object} metadata - Additional operation details
 */
logger.logDatabase = (operation, collection, metadata = {}) => {
    logger.debug('Database Operation', {
        operation,
        collection,
        ...metadata
    });
};

/**
 * Log authentication events
 * 
 * @param {string} event - Authentication event type
 * @param {string} userId - User ID (if available)
 * @param {Object} metadata - Additional event details
 */
logger.logAuth = (event, userId = null, metadata = {}) => {
    logger.info('Authentication Event', {
        event,
        userId,
        ...metadata
    });
};

/**
 * Log business logic events
 * 
 * @param {string} action - Business action performed
 * @param {string} userId - User performing the action
 * @param {Object} metadata - Action details
 */
logger.logBusiness = (action, userId, metadata = {}) => {
    logger.info('Business Action', {
        action,
        userId,
        ...metadata
    });
};

/**
 * Production Error Logging
 * 
 * In production, we want to log errors without exposing sensitive information.
 * This method sanitizes error objects before logging.
 * 
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
logger.logError = (error, context = {}) => {
    // Create sanitized error object
    const errorLog = {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        name: error.name,
        code: error.code,
        ...context
    };
    
    logger.error('Application Error', errorLog);
};

// Export the configured logger
module.exports = logger;