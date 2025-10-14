/**
 * Express Application Configuration for YouthGuard MVP
 * 
 * This file sets up the Express.js application with all necessary middleware,
 * security configurations, and route handlers.
 * 
 * Key Concepts Explained:
 * 1. Express: Web application framework for Node.js
 * 2. Middleware: Functions that execute during request-response cycle
 * 3. CORS: Cross-Origin Resource Sharing for frontend-backend communication
 * 4. Security: Various security measures to protect the API
 * 5. Error Handling: Centralized error handling for the application
 */

// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('../utils/logger');

// Import route handler
const apiRoutes = require('../routes/api');

// Import middleware
const errorHandler = require('../middleware/errorHandler');
const notFound = require('../middleware/notFound');

// Import DI container
const createServiceContainer = require('../dependency-injection/ServiceContainer');
const ControllerFactory = require('../dependency-injection/ControllerFactory');

/**
 * Create Express Application
 * 
 * This function creates and configures the Express application instance.
 * It's organized as a function to make it easier to test and reuse.
 * 
 * @returns {Object} Configured Express application
 */
function createApp() {
    // Initialize Express application
    const app = express();

    // Create DI container and controller factory
    const container = createServiceContainer();
    const controllerFactory = new ControllerFactory(container);
    
    // Make container available to routes
    app.set('container', container);
    app.set('controllerFactory', controllerFactory);

    /**
     * Trust Proxy Configuration
     * 
     * This tells Express to trust the first proxy (like Nginx, Heroku, etc.)
     * Important for:
     * - Getting real client IP addresses
     * - HTTPS redirect handling
     * - Rate limiting accuracy
     */
    app.set('trust proxy', 1);

    /**
     * Security Middleware - Helmet
     * 
     * Helmet helps secure Express apps by setting various HTTP headers.
     * 
     * What it does:
     * - Sets Content-Security-Policy header
     * - Removes X-Powered-By header (hides Express usage)
     * - Sets X-Content-Type-Options to prevent MIME sniffing
     * - Sets X-Frame-Options to prevent clickjacking
     * - Sets X-XSS-Protection header
     */
    app.use(helmet({
        // Content Security Policy configuration
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"]
            }
        },
        // Hide X-Powered-By header
        hidePoweredBy: true,
        // Prevent MIME type sniffing
        noSniff: true,
        // Prevent clickjacking
        frameguard: { action: 'deny' },
        // Enable XSS filter
        xssFilter: true
    }));

    /**
     * CORS Configuration
     * 
     * Cross-Origin Resource Sharing allows frontend applications
     * to communicate with our API from different domains.
     * 
     * Configuration explained:
     * - origin: Which domains can access our API
     * - credentials: Allow cookies and authentication headers
     * - methods: Which HTTP methods are allowed
     * - allowedHeaders: Which headers are allowed in requests
     */
    app.use(cors({
        // Allow requests from specified origins (frontend applications)
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
        
        // Allow credentials (cookies, authorization headers)
        credentials: true,
        
        // Allowed HTTP methods
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        
        // Allowed headers
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin'
        ],
        
        // How long browsers can cache preflight requests (in seconds)
        maxAge: 86400 // 24 hours
    }));

    /**
     * Compression Middleware
     * 
     * Compresses response bodies for all requests to reduce bandwidth usage.
     * 
     * Benefits:
     * - Faster response times
     * - Reduced bandwidth costs
     * - Better user experience
     * 
     * Configuration:
     * - level: Compression level (1-9, higher = better compression but slower)
     * - threshold: Only compress responses larger than this (bytes)
     */
    app.use(compression({
        level: 6,           // Good balance between compression and speed
        threshold: 1024,    // Only compress responses > 1KB
        filter: (req, res) => {
            // Don't compress if request includes 'x-no-compression' header
            if (req.headers['x-no-compression']) {
                return false;
            }
            // Use compression for all other requests
            return compression.filter(req, res);
        }
    }));

    /**
     * Rate Limiting Middleware
     * 
     * Prevents abuse by limiting the number of requests from a single IP.
     * 
     * Why this is important:
     * - Prevents DDoS attacks
     * - Stops brute force login attempts
     * - Protects against API abuse
     * - Ensures fair usage for all users
     */
    const limiter = rateLimit({
        // Time window (15 minutes)
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        
        // Maximum requests per window
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        
        // Error message when limit exceeded
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes'
        },
        
        // Add rate limit info to response headers
        standardHeaders: true,
        
        // Disable legacy headers
        legacyHeaders: false,
        
        // Custom handler for when limit is exceeded
        handler: (req, res) => {
            logger.warn('Rate limit exceeded', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path
            });
            
            res.status(429).json({
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: '15 minutes'
            });
        }
    });
    
    // Apply rate limiting to all requests
    app.use(limiter);

    /**
     * Request Logging Middleware
     * 
     * Morgan logs HTTP requests in a structured format.
     * 
     * Format explained:
     * - :method - HTTP method (GET, POST, etc.)
     * - :url - Request URL
     * - :status - Response status code
     * - :res[content-length] - Response size
     * - :response-time - Time taken to process request
     */
    if (process.env.ENABLE_REQUEST_LOGGING !== 'false') {
        app.use(morgan('combined', {
            // Custom stream to write logs using our logger
            stream: {
                write: (message) => {
                    logger.info(message.trim());
                }
            },
            
            // Skip logging for successful health checks to reduce noise
            skip: (req, res) => {
                return req.url === '/health' && res.statusCode === 200;
            }
        }));
    }

    /**
     * Body Parsing Middleware
     * 
     * These middleware functions parse incoming request bodies.
     * 
     * express.json(): Parses JSON payloads
     * express.urlencoded(): Parses URL-encoded form data
     * 
     * Configuration:
     * - limit: Maximum request body size
     * - extended: Use qs library for parsing (supports nested objects)
     */
    app.use(express.json({ 
        limit: '10mb',  // Maximum JSON payload size
        strict: true    // Only accept arrays and objects
    }));
    
    app.use(express.urlencoded({ 
        extended: true, // Support nested objects
        limit: '10mb'   // Maximum form data size
    }));

    /**
     * Static File Serving
     * 
     * Serve uploaded files (profile pictures, resumes, etc.)
     * 
     * Security considerations:
     * - Files are served from uploads directory only
     * - Direct file system access is prevented
     * - File type validation should be done during upload
     */
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
        // Security options
        dotfiles: 'deny',    // Don't serve hidden files
        index: false,        // Don't serve directory indexes
        maxAge: '1h'         // Cache files for 1 hour
    }));

    /**
     * Health Check Endpoint
     * 
     * Simple endpoint to check if the API is running.
     * Used by:
     * - Load balancers
     * - Monitoring systems
     * - Deployment tools
     */
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0'
        });
    });

    /**
     * API Routes
     * 
     * Mount all route handlers under the /api prefix.
     * This creates a clear API structure and allows for versioning.
     */
    app.use('/api', apiRoutes);

    /**
     * Welcome Route
     * 
     * Simple welcome message for the root endpoint.
     * Helps confirm the API is running and accessible.
     */
    app.get('/', (req, res) => {
        res.json({
            message: 'Welcome to YouthGuard MVP API',
            description: 'Reducing youth involvement in fraud and cybercrime in Nigeria',
            version: '1.0.0',
            documentation: '/api/docs',
            health: '/health'
        });
    });

    /**
     * 404 Handler
     * 
     * Handles requests to non-existent endpoints.
     * This should come after all route definitions.
     */
    app.use(notFound);

    /**
     * Global Error Handler
     * 
     * Catches all errors and sends appropriate responses.
     * This should be the last middleware.
     */
    app.use(errorHandler);

    return app;
}

// Export the app creation function
module.exports = createApp;