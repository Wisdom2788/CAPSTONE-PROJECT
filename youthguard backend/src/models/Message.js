/**
 * Message Model for YouthGuard MVP
 * 
 * This model represents messages between users in the YouthGuard platform.
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SimpleUser',
        required: true
    },
    
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SimpleUser',
        required: true
    },
    
    content: {
        type: String,
        required: true,
        trim: true
    },
    
    isRead: {
        type: Boolean,
        default: false
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'messages'
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;