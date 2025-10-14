/**
 * YouthGuard MVP Server Entry Point
 * 
 * This file starts the Express server and initializes all necessary services.
 * 
 * Key Concepts Explained:
 * 1. Server Bootstrap: Starting the application in the correct order
 * 2. Environment Configuration: Loading environment variables
 * 3. Database Connection: Establishing MongoDB connection
 * 4. Graceful Shutdown: Properly closing connections when server stops
 * 5. Error Handling: Catching and handling startup errors
 */

// Load environment variables first (must be done before other imports)
require('dotenv').config();

// Import required modules
const http = require('http');
const socketIo = require('socket.io');
const createApp = require('./config/app');
const Database = require('./config/database');
const logger = require('./utils/logger');

/**
 * Server Configuration
 * 
 * Get port from environment variables or use default.
 * In production, this is usually set by the hosting platform.
 */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Application Startup Function
 * 
 * This function handles the complete application startup process.
 * It follows a specific order to ensure everything is initialized correctly.
 */
async function startServer() {
    try {
        logger.info('Starting YouthGuard MVP server...', {
            environment: NODE_ENV,
            port: PORT,
            nodeVersion: process.version
        });

        /**
         * Step 1: Connect to Database
         * 
         * We connect to the database first because:
         * - If database connection fails, the app shouldn't start
         * - Routes depend on database models
         * - Better to fail fast if database is unavailable
         */
        logger.info('Connecting to MongoDB...');
        await Database.connect();
        logger.info('Database connected successfully');

        /**
         * Step 2: Create Express Application
         * 
         * This creates our Express app with all middleware and routes configured.
         */
        logger.info('Creating Express application...');
        const app = createApp();
        logger.info('Express application created');
        
        // Add some debug logging
        logger.info('Setting up HTTP server...');
        
        /**
         * Step 3: Create HTTP Server
         * 
         * We create an HTTP server instance that we can use with Socket.IO
         * for real-time communication features (messaging, notifications).
         */
        const server = http.createServer(app);
        logger.info('HTTP server created');

        /**
         * Step 4: Set up Socket.IO for Real-time Communication
         * 
         * Socket.IO enables real-time features like:
         * - Live messaging between users
         * - Real-time notifications
         * - Live updates (new job postings, course progress)
         * 
         * Configuration explained:
         * - cors: Allow connections from frontend applications
         * - pingTimeout: How long to wait for ping response
         * - pingInterval: How often to send ping to check connection
         */
        logger.info('Setting up Socket.IO...');
        const io = socketIo(server, {
            cors: {
                origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            },
            pingTimeout: 60000,
            pingInterval: 25000
        });
        logger.info('Socket.IO configured');

        /**
         * Socket.IO Connection Handler
         * 
         * This handles new socket connections from clients.
         * Each user who connects gets their own socket instance.
         */
        io.on('connection', (socket) => {
            logger.info('New socket connection', {
                socketId: socket.id,
                userAgent: socket.handshake.headers['user-agent'],
                ip: socket.handshake.address
            });

            /**
             * User Authentication for Socket
             * 
             * Users need to authenticate their socket connection
             * to receive personalized notifications and messages.
             */
            socket.on('authenticate', (data) => {
                try {
                    // TODO: Verify JWT token and associate socket with user
                    // For now, we'll just log the authentication attempt
                    logger.info('Socket authentication attempt', {
                        socketId: socket.id,
                        userId: data.userId
                    });
                    
                    // Join user to their personal room for private messages
                    socket.join(`user_${data.userId}`);
                    
                    socket.emit('authenticated', {
                        success: true,
                        message: 'Socket authenticated successfully'
                    });
                } catch (error) {
                    logger.error('Socket authentication failed', {
                        socketId: socket.id,
                        error: error.message
                    });
                    
                    socket.emit('authentication_error', {
                        success: false,
                        message: 'Authentication failed'
                    });
                }
            });

            /**
             * Handle Private Messages
             * 
             * This allows users to send real-time messages to each other.
             */
            socket.on('send_message', (data) => {
                try {
                    // TODO: Validate message and save to database
                    // For now, we'll just forward the message
                    
                    logger.info('Message sent via socket', {
                        fromUserId: data.fromUserId,
                        toUserId: data.toUserId,
                        socketId: socket.id
                    });
                    
                    // Send message to recipient's room
                    socket.to(`user_${data.toUserId}`).emit('new_message', {
                        fromUserId: data.fromUserId,
                        message: data.message,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Confirm message sent
                    socket.emit('message_sent', {
                        success: true,
                        messageId: data.messageId
                    });
                } catch (error) {
                    logger.error('Error sending message via socket', {
                        error: error.message,
                        socketId: socket.id
                    });
                    
                    socket.emit('message_error', {
                        success: false,
                        message: 'Failed to send message'
                    });
                }
            });

            /**
             * Handle Socket Disconnection
             * 
             * Clean up when user disconnects.
             */
            socket.on('disconnect', (reason) => {
                logger.info('Socket disconnected', {
                    socketId: socket.id,
                    reason: reason
                });
            });

            /**
             * Handle Socket Errors
             * 
             * Log any socket-related errors for debugging.
             */
            socket.on('error', (error) => {
                logger.error('Socket error', {
                    socketId: socket.id,
                    error: error.message
                });
            });
        });

        /**
         * Make Socket.IO available to route handlers
         * 
         * This allows our API endpoints to send real-time notifications.
         * For example: when a job application is received, notify the employer.
         */
        app.set('io', io);

        /**
         * Step 5: Start the Server
         * 
         * Begin listening for HTTP requests on the specified port.
         */
        logger.info(`Starting server on port ${PORT}...`);
        server.listen(PORT, () => {
            logger.info('YouthGuard MVP server started successfully', {
                port: PORT,
                environment: NODE_ENV,
                processId: process.pid,
                timestamp: new Date().toISOString(),
                endpoints: {
                    api: `http://localhost:${PORT}/api`,
                    health: `http://localhost:${PORT}/health`,
                    docs: `http://localhost:${PORT}/api/docs`
                }
            });

            // Log startup summary
            console.log(`\n🚀 YouthGuard MVP Server is running!`);
            console.log(`📍 Port: ${PORT}`);
            console.log(`🌍 Environment: ${NODE_ENV}`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
            console.log(`❤️  Health: http://localhost:${PORT}/health`);
            console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
            console.log(`\n💡 Ready to reduce youth involvement in cybercrime!\n`);
        });
        logger.info('Server listen command issued');

        /**
         * Handle Server Errors
         * 
         * Listen for server-level errors (port in use, permission denied, etc.)
         */
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is already in use`, {
                    port: PORT,
                    suggestion: 'Try a different port or stop the existing process'
                });
            } else if (error.code === 'EACCES') {
                logger.error(`Permission denied to bind to port ${PORT}`, {
                    port: PORT,
                    suggestion: 'Try running with sudo or use a port > 1024'
                });
            } else {
                logger.error('Server error', {
                    error: error.message,
                    code: error.code
                });
            }
            
            process.exit(1);
        });

        /**
         * Graceful Shutdown Handlers
         * 
         * These handle various termination signals and ensure the server
         * shuts down gracefully, closing all connections properly.
         */
        
        // Handle Ctrl+C (SIGINT)
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        
        // Handle process termination (SIGTERM) 
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception', {
                error: error.message,
                stack: error.stack
            });
            gracefulShutdown('uncaughtException');
        });
        
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection', {
                reason: reason,
                promise: promise
            });
            gracefulShutdown('unhandledRejection');
        });

        /**
         * Graceful Shutdown Function
         * 
         * This function handles the proper shutdown of the server:
         * 1. Stop accepting new connections
         * 2. Close existing connections
         * 3. Disconnect from database
         * 4. Exit the process
         * 
         * @param {string} signal - The signal that triggered the shutdown
         */
        async function gracefulShutdown(signal) {
            logger.info(`Received ${signal}, starting graceful shutdown...`);
            
            try {
                // Stop accepting new connections
                server.close(async () => {
                    logger.info('HTTP server closed');
                    
                    try {
                        // Close Socket.IO connections
                        io.close(() => {
                            logger.info('Socket.IO server closed');
                        });
                        
                        // Disconnect from database
                        await Database.disconnect();
                        
                        logger.info('Graceful shutdown completed');
                        process.exit(0);
                    } catch (error) {
                        logger.error('Error during graceful shutdown', {
                            error: error.message
                        });
                        process.exit(1);
                    }
                });
                
                // Force exit after 30 seconds if graceful shutdown fails
                setTimeout(() => {
                    logger.error('Forceful shutdown after timeout');
                    process.exit(1);
                }, 30000);
                
            } catch (error) {
                logger.error('Error during graceful shutdown', {
                    error: error.message
                });
                process.exit(1);
            }
        }
        
    } catch (error) {
        /**
         * Startup Error Handler
         * 
         * If any error occurs during startup, log it and exit.
         * Common startup errors:
         * - Database connection failure
         * - Port already in use
         * - Missing environment variables
         * - File permission issues
         */
        logger.error('Failed to start server', {
            error: error.message,
            stack: error.stack
        });
        
        console.error('\n❌ Failed to start YouthGuard MVP server:');
        console.error(`   ${error.message}`);
        console.error('\n🔧 Please check the following:');
        console.error('   - MongoDB is running and accessible');
        console.error('   - Port is not already in use');
        console.error('   - Environment variables are properly set');
        console.error('   - All dependencies are installed\n');
        
        process.exit(1);
    }
}

// Add some debugging to see if the process is being terminated
process.on('beforeExit', () => {
    logger.info('Process beforeExit event');
});

process.on('exit', (code) => {
    logger.info(`Process exit event with code: ${code}`);
});

/**
 * Start the Application
 * 
 * Call the startup function to begin the server initialization process.
 */
logger.info('Starting server application...');
startServer();