/**
 * Simple YouthGuard Server - Clean Architecture
 * 
 * This is a simplified version focusing on the core layered architecture:
 * - Controllers: Handle HTTP requests and responses
 * - Services: Contain business logic
 * - Repositories: Handle data access
 * - Models: Define data structures and validation
 */

// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Import models to ensure they're registered with Mongoose
require('./models/SimpleUser');
require('./models/Course');
require('./models/Lesson');
require('./models/Job');
require('./models/Application');
require('./models/Message');
require('./models/Progress');

// Import simple routes
const apiRoutes = require('./routes/simple-api');

// Server configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youthguard_dev';

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Welcome endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'YouthGuard MVP API',
        description: 'Reducing youth involvement in fraud and cybercrime in Nigeria',
        version: '1.0.0'
    });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Database connection and server startup
async function startServer() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
        
        // Start server
        const server = app.listen(PORT, () => {
            console.log(`\n🚀 YouthGuard MVP Server is running!`);
            console.log(`📍 Port: ${PORT}`);
            console.log(`🔗 Health: http://localhost:${PORT}/health`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
            console.log(`\n💡 Ready to reduce youth involvement in cybercrime!\n`);
        });
        
        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('Shutting down server...');
            await mongoose.connection.close();
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Start the server
startServer();