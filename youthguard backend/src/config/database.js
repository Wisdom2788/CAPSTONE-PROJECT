/**
 * Database Configuration for YouthGuard MVP
 * 
 * This file handles MongoDB connection setup using Mongoose ODM.
 * 
 * Key Concepts Explained:
 * 1. Mongoose: Object Document Mapper (ODM) for MongoDB and Node.js
 * 2. Connection Options: Configuration for optimal performance and reliability
 * 3. Event Handlers: Listen for connection events (connected, error, disconnected)
 * 4. Graceful Shutdown: Properly close database connections when app terminates
 */

// Import required modules
const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Database Connection Class
 * 
 * This class encapsulates all database connection logic.
 * Benefits:
 * - Centralized connection management
 * - Easy to test and mock
 * - Reusable across different environments
 */
class Database {
    /**
     * Connect to MongoDB database
     * 
     * @param {string} uri - MongoDB connection string
     * @returns {Promise} - Resolves when connected, rejects on error
     */
    static async connect(uri = process.env.MONGODB_URI) {
        try {
            // Connection options for optimal performance and reliability
            const options = {
                // Maximum number of connections in the connection pool
                maxPoolSize: 10,
                
                // Close connections after 30 seconds of inactivity
                serverSelectionTimeoutMS: 5000,
                
                // Time to wait for a connection to be established
                socketTimeoutMS: 45000,
                
                // Heartbeat frequency (how often to check if server is alive)
                heartbeatFrequencyMS: 10000,
                
                // Buffer commands when connection is lost (false for immediate errors)
                bufferCommands: false
                // Removed deprecated options:
                // - useNewUrlParser (not needed in MongoDB driver 4.0+)
                // - useUnifiedTopology (not needed in MongoDB driver 4.0+)
                // - bufferMaxEntries (deprecated)
            };

            // Attempt to connect to MongoDB
            await mongoose.connect(uri, options);
            
            // Log successful connection
            logger.info('MongoDB connected successfully', {
                database: mongoose.connection.db.databaseName,
                host: mongoose.connection.host,
                port: mongoose.connection.port
            });
            
        } catch (error) {
            // Log connection error with details
            logger.error('MongoDB connection failed', {
                error: error.message,
                uri: uri.replace(/\/\/.*@/, '//***:***@') // Hide credentials in logs
            });
            
            // Re-throw error to be handled by calling function
            throw error;
        }
    }

    /**
     * Disconnect from MongoDB
     * 
     * This method gracefully closes the database connection.
     * Important for:
     * - Preventing memory leaks
     * - Allowing application to shut down cleanly
     * - Freeing up database resources
     */
    static async disconnect() {
        try {
            await mongoose.disconnect();
            logger.info('MongoDB disconnected successfully');
        } catch (error) {
            logger.error('Error disconnecting from MongoDB', {
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Get current connection status
     * 
     * Mongoose connection states:
     * 0 = disconnected
     * 1 = connected  
     * 2 = connecting
     * 3 = disconnecting
     * 
     * @returns {number} Connection state
     */
    static getConnectionState() {
        return mongoose.connection.readyState;
    }

    /**
     * Check if database is connected
     * 
     * @returns {boolean} True if connected, false otherwise
     */
    static isConnected() {
        return mongoose.connection.readyState === 1;
    }
}

/**
 * Set up database event listeners
 * 
 * These event handlers help monitor the database connection status
 * and log important events for debugging and monitoring.
 */

// Connection successful
mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to MongoDB');
});

// Connection error
mongoose.connection.on('error', (error) => {
    logger.error('Mongoose connection error', {
        error: error.message
    });
});

// Connection disconnected
mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from MongoDB');
});

// Connection reconnected
mongoose.connection.on('reconnected', () => {
    logger.info('Mongoose reconnected to MongoDB');
});

/**
 * Graceful shutdown handler
 * 
 * This ensures the database connection is properly closed when the
 * application is terminated (Ctrl+C, process kill, etc.)
 * 
 * Why this is important:
 * - Prevents connection leaks
 * - Ensures data integrity
 * - Clean application shutdown
 */
process.on('SIGINT', async () => {
    try {
        await Database.disconnect();
        logger.info('Database connection closed due to application termination');
        process.exit(0);
    } catch (error) {
        logger.error('Error during graceful shutdown', {
            error: error.message
        });
        process.exit(1);
    }
});

// Export the Database class for use in other modules
module.exports = Database;