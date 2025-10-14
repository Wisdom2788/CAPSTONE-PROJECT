/**
 * Message Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for Message documents.
 * It extends the BaseRepository and provides message-specific functionality
 * such as conversation management, message threading, and real-time messaging.
 * 
 * Key Features:
 * - Message sending and retrieval
 * - Conversation management
 * - Message threading and replies
 * - Message reactions and interactions
 * - Message search and filtering
 * - Real-time message synchronization
 */

const BaseRepository = require('./BaseRepository');
const Message = require('../models/Message');
const logger = require('../utils/logger');

/**
 * MessageRepository Class
 * 
 * Repository for Message model with specialized operations.
 */
class MessageRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(Message);
    }
    
    /**
     * Find messages by conversation
     * @param {String} conversationId - Conversation ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Messages with pagination
     */
    async findByConversation(conversationId, options = {}) {
        try {
            const result = await this.findMany(
                { 
                    conversation: conversationId,
                    visibility: 'visible'
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'sender'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding messages by conversation', { 
                error: error.message, 
                conversationId
            });
            throw error;
        }
    }
    
    /**
     * Find messages by sender
     * @param {String} senderId - Sender user ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Messages with pagination
     */
    async findBySender(senderId, options = {}) {
        try {
            const result = await this.findMany(
                { sender: senderId, visibility: 'visible' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'conversation'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding messages by sender', { 
                error: error.message, 
                senderId
            });
            throw error;
        }
    }
    
    /**
     * Find messages by type
     * @param {String} messageType - Message type
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Messages with pagination
     */
    async findByType(messageType, options = {}) {
        try {
            const result = await this.findMany(
                { 'content.type': messageType, visibility: 'visible' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'sender conversation'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding messages by type', { 
                error: error.message, 
                messageType
            });
            throw error;
        }
    }
    
    /**
     * Search messages by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchMessages(searchText, options = {}) {
        try {
            const searchCriteria = {
                $text: { $search: searchText },
                visibility: 'visible',
                ...options.criteria
            };
            
            const result = await this.findMany(
                searchCriteria,
                {
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: { score: { $meta: 'textScore' } },
                    select: options.select,
                    populate: options.populate || 'sender conversation'
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error searching messages', { 
                error: error.message, 
                searchText
            });
            throw error;
        }
    }
    
    /**
     * Find unread messages for a user
     * @param {String} userId - User ID
     * @param {String} conversationId - Optional conversation ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Unread messages with pagination
     */
    async findUnreadForUser(userId, conversationId = null, options = {}) {
        try {
            const criteria = {
                'readBy.user': { $ne: userId },
                sender: { $ne: userId }, // Don't include own messages
                visibility: 'visible'
            };
            
            if (conversationId) {
                criteria.conversation = conversationId;
            }
            
            const result = await this.findMany(
                criteria,
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'sender conversation'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding unread messages for user', { 
                error: error.message, 
                userId,
                conversationId
            });
            throw error;
        }
    }
    
    /**
     * Find messages with attachments
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Messages with pagination
     */
    async findWithAttachments(options = {}) {
        try {
            const result = await this.findMany(
                { 
                    attachments: { $exists: true, $ne: [] },
                    visibility: 'visible'
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'sender conversation'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding messages with attachments', { 
                error: error.message
            });
            throw error;
        }
    }
    
    /**
     * Find messages by date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Messages with pagination
     */
    async findByDateRange(startDate, endDate, options = {}) {
        try {
            const result = await this.findMany(
                { 
                    createdAt: { 
                        $gte: startDate, 
                        $lte: endDate 
                    },
                    visibility: 'visible'
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select,
                    populate: options.populate || 'sender conversation'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding messages by date range', { 
                error: error.message, 
                startDate,
                endDate
            });
            throw error;
        }
    }
    
    /**
     * Mark message as read by user
     * @param {String} messageId - Message ID
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Updated message or null
     */
    async markAsRead(messageId, userId) {
        try {
            const message = await this.model.findByIdAndUpdate(
                messageId,
                {
                    $addToSet: {
                        'readBy': {
                            user: userId,
                            readAt: new Date()
                        }
                    }
                },
                { new: true }
            );
            return message;
        } catch (error) {
            logger.error('Error marking message as read', { 
                error: error.message, 
                messageId,
                userId
            });
            throw error;
        }
    }
    
    /**
     * Mark multiple messages as read by user
     * @param {Array} messageIds - Array of message IDs
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Number of messages updated
     */
    async markMultipleAsRead(messageIds, userId) {
        try {
            const result = await this.model.updateMany(
                {
                    _id: { $in: messageIds },
                    'readBy.user': { $ne: userId }
                },
                {
                    $addToSet: {
                        'readBy': {
                            user: userId,
                            readAt: new Date()
                        }
                    }
                }
            );
            
            return result.modifiedCount;
        } catch (error) {
            logger.error('Error marking multiple messages as read', { 
                error: error.message, 
                messageIds,
                userId
            });
            throw error;
        }
    }
    
    /**
     * Add reaction to message
     * @param {String} messageId - Message ID
     * @param {String} emoji - Emoji reaction
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Updated message or null
     */
    async addReaction(messageId, emoji, userId) {
        try {
            // First, try to update existing reaction
            const message = await this.model.findOneAndUpdate(
                { 
                    _id: messageId, 
                    'reactions.emoji': emoji,
                    'reactions.users': { $ne: userId }
                },
                {
                    $addToSet: { 'reactions.$.users': userId },
                    $inc: { 'reactions.$.count': 1 }
                },
                { new: true }
            );
            
            // If no existing reaction found, add new reaction
            if (!message) {
                return await this.model.findByIdAndUpdate(
                    messageId,
                    {
                        $addToSet: {
                            reactions: {
                                emoji: emoji,
                                users: [userId],
                                count: 1
                            }
                        }
                    },
                    { new: true }
                );
            }
            
            return message;
        } catch (error) {
            logger.error('Error adding reaction to message', { 
                error: error.message, 
                messageId,
                emoji,
                userId
            });
            throw error;
        }
    }
    
    /**
     * Remove reaction from message
     * @param {String} messageId - Message ID
     * @param {String} emoji - Emoji reaction
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Updated message or null
     */
    async removeReaction(messageId, emoji, userId) {
        try {
            const message = await this.model.findOneAndUpdate(
                { 
                    _id: messageId, 
                    'reactions.emoji': emoji,
                    'reactions.users': userId
                },
                {
                    $pull: { 'reactions.$.users': userId },
                    $inc: { 'reactions.$.count': -1 }
                },
                { new: true }
            );
            
            // Remove reaction entirely if count is 0
            if (message) {
                const reaction = message.reactions.find(r => r.emoji === emoji);
                if (reaction && reaction.count <= 0) {
                    await this.model.findByIdAndUpdate(
                        messageId,
                        { $pull: { reactions: { emoji: emoji } } }
                    );
                }
            }
            
            return message;
        } catch (error) {
            logger.error('Error removing reaction from message', { 
                error: error.message, 
                messageId,
                emoji,
                userId
            });
            throw error;
        }
    }
    
    /**
     * Get message statistics
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} Message statistics
     */
    async getStatistics(filters = {}) {
        try {
            const matchStage = { visibility: 'visible', ...filters };
            
            const stats = await this.model.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        byType: {
                            $push: '$content.type'
                        },
                        byConversation: {
                            $push: '$conversation'
                        },
                        totalAttachments: {
                            $sum: { $size: '$attachments' }
                        },
                        totalReactions: {
                            $sum: {
                                $reduce: {
                                    input: '$reactions',
                                    initialValue: 0,
                                    in: { $add: ['$$value', '$$this.count'] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        byType: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byType'] },
                                    as: 'type',
                                    in: {
                                        k: '$$type',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byType',
                                                    cond: { $eq: ['$$this', '$$type'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byConversation: {
                            $size: { $setUnion: ['$byConversation'] }
                        },
                        totalAttachments: 1,
                        totalReactions: 1
                    }
                }
            ]);
            
            return stats[0] || { 
                total: 0, 
                byType: {}, 
                byConversation: 0,
                totalAttachments: 0,
                totalReactions: 0
            };
        } catch (error) {
            logger.error('Error getting message statistics', { 
                error: error.message,
                filters
            });
            throw error;
        }
    }
    
    /**
     * Find recent messages in conversations
     * @param {Array} conversationIds - Array of conversation IDs
     * @param {Object} options - Query options
     * @returns {Promise<Array>} Recent messages
     */
    async findRecentInConversations(conversationIds, options = {}) {
        try {
            const messages = await this.model.aggregate([
                {
                    $match: {
                        conversation: { $in: conversationIds },
                        visibility: 'visible'
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: '$conversation',
                        message: { $first: '$$ROOT' }
                    }
                },
                {
                    $replaceRoot: { newRoot: '$message' }
                },
                {
                    $sort: options.sort || { createdAt: -1 }
                },
                {
                    $limit: options.limit || 50
                }
            ]);
            
            return { documents: messages };
        } catch (error) {
            logger.error('Error finding recent messages in conversations', { 
                error: error.message,
                conversationIds
            });
            throw error;
        }
    }
    
    /**
     * Find messages that need moderation
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Flagged messages with pagination
     */
    async findFlaggedMessages(options = {}) {
        try {
            const result = await this.findMany(
                {
                    'moderation.flagged': true,
                    visibility: { $ne: 'deleted' }
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { 'moderation.flaggedBy.flaggedAt': -1 },
                    select: options.select,
                    populate: options.populate || 'sender conversation'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding flagged messages', { 
                error: error.message
            });
            throw error;
        }
    }
    
    /**
     * Update message visibility (hide/delete)
     * @param {String} messageId - Message ID
     * @param {String} visibility - New visibility status
     * @returns {Promise<Object|null>} Updated message or null
     */
    async updateVisibility(messageId, visibility) {
        try {
            const message = await this.update(messageId, {
                visibility: visibility,
                'moderation.moderatedAt': new Date()
            });
            return message;
        } catch (error) {
            logger.error('Error updating message visibility', { 
                error: error.message, 
                messageId,
                visibility
            });
            throw error;
        }
    }
}

module.exports = MessageRepository;