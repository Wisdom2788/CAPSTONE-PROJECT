/**
 * Message Service for YouthGuard MVP
 * 
 * This service handles all business logic related to messaging.
 */

const Message = require('../models/Message');

class MessageService {
    /**
     * Send a new message
     * @param {Object} messageData - Message data
     * @returns {Promise<Object>} Created message
     */
    async sendMessage(messageData) {
        try {
            const message = new Message(messageData);
            const savedMessage = await message.save();
            return savedMessage;
        } catch (error) {
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }

    /**
     * Get messages between two users
     * @param {String} userId1 - First user ID
     * @param {String} userId2 - Second user ID
     * @returns {Promise<Array>} List of messages
     */
    async getMessagesBetweenUsers(userId1, userId2) {
        try {
            const messages = await Message.find({
                $or: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 }
                ]
            }).sort({ createdAt: 1 });
            
            return messages;
        } catch (error) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }

    /**
     * Mark message as read
     * @param {String} messageId - Message ID
     * @returns {Promise<Object>} Updated message
     */
    async markAsRead(messageId) {
        try {
            const message = await Message.findByIdAndUpdate(
                messageId,
                { isRead: true },
                { new: true }
            );
            
            if (!message) {
                throw new Error('Message not found');
            }
            
            return message;
        } catch (error) {
            throw new Error(`Failed to mark message as read: ${error.message}`);
        }
    }

    /**
     * Get unread messages for user
     * @param {String} userId - User ID
     * @returns {Promise<Array>} List of unread messages
     */
    async getUnreadMessages(userId) {
        try {
            const messages = await Message.find({
                receiverId: userId,
                isRead: false
            }).sort({ createdAt: -1 });
            
            return messages;
        } catch (error) {
            throw new Error(`Failed to fetch unread messages: ${error.message}`);
        }
    }
}

module.exports = MessageService;