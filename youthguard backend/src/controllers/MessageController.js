/**
 * Message Controller for YouthGuard MVP
 * 
 * This controller handles all HTTP requests related to messaging.
 */

const MessageService = require('../services/MessageService');

class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }

    /**
     * Send a new message
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async sendMessage(req, res) {
        try {
            const message = await this.messageService.sendMessage(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Message sent successfully',
                data: message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get messages between two users
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getMessagesBetweenUsers(req, res) {
        try {
            const { userId1, userId2 } = req.params;
            const messages = await this.messageService.getMessagesBetweenUsers(userId1, userId2);
            
            res.status(200).json({
                success: true,
                message: 'Messages retrieved successfully',
                data: messages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Mark message as read
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const message = await this.messageService.markAsRead(id);
            
            res.status(200).json({
                success: true,
                message: 'Message marked as read',
                data: message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get unread messages for user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUnreadMessages(req, res) {
        try {
            const { userId } = req.params;
            const messages = await this.messageService.getUnreadMessages(userId);
            
            res.status(200).json({
                success: true,
                message: 'Unread messages retrieved successfully',
                data: messages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = MessageController;
