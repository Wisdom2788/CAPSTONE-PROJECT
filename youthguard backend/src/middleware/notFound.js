/**
 * 404 Not Found Middleware for YouthGuard MVP
 * 
 * This middleware handles requests to endpoints that don't exist.
 * It should be placed after all route definitions but before the error handler.
 * 
 * Key Concepts Explained:
 * 1. Middleware Order: This runs only if no other routes match
 * 2. 404 Errors: Resource not found - different from server errors (500)
 * 3. Consistent Response: Provides same format as other error responses
 * 4. Logging: Track which endpoints users are trying to access
 */

const logger = require('../utils/logger');

/**
 * Not Found Handler Middleware
 * 
 * This function handles all requests that don't match any defined routes.
 * 
 * What it does:
 * 1. Logs the attempted request for monitoring
 * 2. Returns a consistent 404 error response
 * 3. Provides helpful information about available endpoints
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function (not used here)
 */
function notFound(req, res, next) {
    /**
     * Log the 404 attempt
     * 
     * This helps us understand:
     * - Which endpoints users are looking for
     * - Potential typos in frontend applications
     * - Possible security scanning attempts
     * - Missing routes we should implement
     */
    logger.warn('404 - Route not found', {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || 'anonymous',
        referer: req.get('Referer') || 'direct'
    });

    /**
     * Create helpful error response
     * 
     * The response includes:
     * - Clear error message
     * - Suggested alternatives
     * - Available API documentation
     * - HTTP status code
     */
    const errorResponse = {
        success: false,
        error: {
            message: `Route ${req.method} ${req.originalUrl} not found`,
            statusCode: 404,
            suggestion: 'Check the URL and HTTP method, or visit /api/docs for available endpoints',
            availableEndpoints: {
                authentication: '/api/auth',
                users: '/api/users',
                courses: '/api/courses',
                jobs: '/api/jobs',
                messages: '/api/messages',
                health: '/health',
                documentation: '/api/docs'
            },
            timestamp: new Date().toISOString()
        }
    };

    /**
     * Send 404 response
     * 
     * Status 404: Not Found
     * This indicates that the server can't find the requested resource.
     */
    res.status(404).json(errorResponse);
}

/**
 * Method Not Allowed Handler
 * 
 * This function handles requests to valid routes but with invalid HTTP methods.
 * For example: POST to a GET-only endpoint.
 * 
 * @param {Array} allowedMethods - Array of allowed HTTP methods
 * @returns {Function} Middleware function
 */
function methodNotAllowed(allowedMethods = []) {
    return (req, res, next) => {
        /**
         * Log the method not allowed attempt
         */
        logger.warn('405 - Method not allowed', {
            method: req.method,
            url: req.originalUrl,
            allowedMethods: allowedMethods,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            userId: req.user?.id || 'anonymous'
        });

        /**
         * Set Allow header to inform client of valid methods
         */
        res.set('Allow', allowedMethods.join(', '));

        /**
         * Send 405 response
         */
        res.status(405).json({
            success: false,
            error: {
                message: `Method ${req.method} not allowed for ${req.originalUrl}`,
                statusCode: 405,
                allowedMethods: allowedMethods,
                timestamp: new Date().toISOString()
            }
        });
    };
}

/**
 * API Version Not Supported Handler
 * 
 * For future API versioning, this handles requests to unsupported versions.
 * 
 * @param {string} requestedVersion - The version requested by client
 * @param {Array} supportedVersions - Array of supported API versions
 * @returns {Function} Middleware function
 */
function versionNotSupported(requestedVersion, supportedVersions = ['v1']) {
    return (req, res, next) => {
        logger.warn('API version not supported', {
            requestedVersion: requestedVersion,
            supportedVersions: supportedVersions,
            url: req.originalUrl,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        });

        res.status(400).json({
            success: false,
            error: {
                message: `API version ${requestedVersion} is not supported`,
                statusCode: 400,
                supportedVersions: supportedVersions,
                latestVersion: supportedVersions[supportedVersions.length - 1],
                timestamp: new Date().toISOString()
            }
        });
    };
}

module.exports = {
    notFound,
    methodNotAllowed,
    versionNotSupported
};