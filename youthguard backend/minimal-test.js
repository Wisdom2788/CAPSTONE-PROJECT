/**
 * Minimal Test - Check what's working
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('Environment variables:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI);
console.log('- PORT:', process.env.PORT);

console.log('Testing MongoDB connection...');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youthguard_dev')
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log('Database:', mongoose.connection.db.databaseName);
        
        // Keep the process alive for a bit
        setTimeout(() => {
            console.log('Closing connection...');
            mongoose.connection.close();
            console.log('Done');
            process.exit(0);
        }, 5000);
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    });