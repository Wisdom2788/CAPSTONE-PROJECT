/**
 * Conversation Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for Conversation documents.
 * It extends the BaseRepository and provides conversation-specific functionality
 * such as participant management, conversation creation, and real-time updates.
 * 
 * Key Features:
 * - Conversation creation and management
 * - Participant management
 * - Conversation search and filtering
 * - Real-time conversation updates
 * - Privacy and moderation management
 */

const BaseRepository = require('./BaseRepository');
const Conversation = require('../models/Conversation');
const logger = require('../utils/logger');

/**
 * ConversationRepository Class
 * 
 * Repository for Conversation model with specialized operations.
 */
class ConversationRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(Conversation);
    }
    
    /**
     * Find conversations for a user
     * @param {String} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Conversations with pagination
     */
    async findForUser(userId, options = {}) {
        try {
            const result = await this.findMany(
                {
                    'participants.user': userId,
                    'participants.status': 'active',
                    status: 'active'
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { lastActivity: -1 },
                    select: options.select,
                    populate: options.populate || 'participants.user lastMessage'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding conversations for user', { 
                error: error.message, 
                userId
            });
            throw error;
        }
    }
    
    /**
     * Find conversation by type
     * @param {String} type - Conversation type
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Conversations with pagination
     */
    async findByType(type, options = {}) {
        try {
            const result = await this.findMany(
                { type: type, status: 'active' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { lastActivity: -1 },
                    select: options.select,
                    populate: options.populate || 'participants.user lastMessage'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding conversations by type', { 
                error: error.message, 
                type
            });
            throw error;
        }
    }
    
    /**
     * Find conversation by participants (for direct messages)
     * @param {Array} participantIds - Array of participant user IDs
     * @returns {Promise<Object|null>} Conversation or null
     */
    async findByParticipants(participantIds) {
        try {
            const conversation = await this.model.findOne({
                type: 'direct',
                'participants.user': { $all: participantIds },
                'participants.status': 'active',
                status: 'active'
            });
            return conversation;
        } catch (error) {
            logger.error('Error finding conversation by participants', { 
                error: error.message, 
                participantIds
            });
            throw error;
        }
    }
    
    /**
     * Create a direct conversation between two users
     * @param {String} userId1 - First user ID
     * @param {String} userId2 - Second user ID
     * @param {String} createdBy - User who created the conversation
     * @returns {Promise<Object>} Created conversation
     */
    async createDirectConversation(userId1, userId2, createdBy) {
        try {
            // Check if conversation already exists
            const existing = await this.findByParticipants([userId1, userId2]);
            if (existing) {
                return existing;
            }
            
            // Create new direct conversation
            const conversation = await this.create({
                type: 'direct',
                createdBy: createdBy,
                participants: [
                    { user: userId1, role: 'admin', status: 'active' },
                    { user: userId2, role: 'admin', status: 'active' }
                ]
            });
            
            return conversation;
        } catch (error) {
            logger.error('Error creating direct conversation', { 
                error: error.message, 
                userId1,
                userId2,
                createdBy
            });
            throw error;
        }
    }
    
    /**
     * Search conversations by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchConversations(searchText, options = {}) {
        try {
            const searchCriteria = {
                $text: { $search: searchText },
                status: 'active',
                ...options.criteria
            };
            
            const result = await this.findMany(
                searchCriteria,
                {
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: { score: { $meta: 'textScore' } },
                    select: options.select,
                    populate: options.populate || 'participants.user lastMessage'
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error searching conversations', { 
                error: error.message, 
                searchText
            });
            throw error;
        }
    }
    
    /**
     * Add participant to conversation
     * @param {String} conversationId - Conversation ID
     * @param {String} userId - User ID to add
     * @param {String} addedBy - User ID who is adding
     * @param {String} role - Participant role
     * @returns {Promise<Object|null>} Updated conversation or null
     */
    async addParticipant(conversationId, userId, addedBy, role = 'member') {
        try {
            const conversation = await this.model.findByIdAndUpdate(
                conversationId,
                {
                    $addToSet: {
                        participants: {
                            user: userId,
                            role: role,
                            invitedBy: addedBy,
                            joinedAt: new Date(),
                            status: 'active'
                        }
                    },
                    lastActivity: new Date()
                },
                { new: true }
            );
            return conversation;
        } catch (error) {
            logger.error('Error adding participant to conversation', { 
                error: error.message, 
                conversationId,
                userId,
                addedBy,
                role
            });
            throw error;
        }
    }
    
    /**
     * Remove participant from conversation
     * @param {String} conversationId - Conversation ID
     * @param {String} userId - User ID to remove
     * @param {String} removedBy - User ID who is removing
     * @returns {Promise<Object|null>} Updated conversation or null
     */
    async removeParticipant(conversationId, userId, removedBy) {
        try {
            const conversation = await this.model.findByIdAndUpdate(
                conversationId,
                {
                    $set: {
                        'participants.$[elem].status': 'left',
                        'participants.$[elem].leftAt': new Date()
                    },
                    lastActivity: new Date()
                },
                {
                    new: true,
                    arrayFilters: [{ 'elem.user': userId, 'elem.status': 'active' }]
                }
            );
            return conversation;
        } catch (error) {
            logger.error('Error removing participant from conversation', { 
                error: error.message, 
                conversationId,
                userId,
                removedBy
            });
            throw error;
        }
    }
    
    /**
     * Update participant role
     * @param {String} conversationId - Conversation ID
     * @param {String} userId - User ID
     * @param {String} newRole - New role
     * @param {String} updatedBy - User ID who is updating
     * @returns {Promise<Object|null>} Updated conversation or null
     */
    async updateParticipantRole(conversationId, userId, newRole, updatedBy) {
        try {
            const conversation = await this.model.findByIdAndUpdate(
                conversationId,
                {
                    $set: {
                        'participants.$[elem].role': newRole
                    },
                    lastActivity: new Date()
                },
                {
                    new: true,
                    arrayFilters: [{ 'elem.user': userId, 'elem.status': 'active' }]
                }
            );
            return conversation;
        } catch (error) {
            logger.error('Error updating participant role', { 
                error: error.message, 
                conversationId,
                userId,
                newRole,
                updatedBy
            });
            throw error;
        }
    }
    
    /**
     * Find conversation by join token
     * @param {String} token - Join token
     * @returns {Promise<Object|null>} Conversation or null
     */
    async findByJoinToken(token) {
        try {
            const conversation = await this.model.findOne({
                'privacy.joinLink.enabled': true,
                'privacy.joinLink.token': token,
                'privacy.joinLink.expiresAt': { $gt: new Date() },
                status: 'active'
            });
            return conversation;
        } catch (error) {
            logger.error('Error finding conversation by join token', { 
                error: error.message, 
                token
            });
            throw error;
        }
    }
    
    /**
     * Generate join link for conversation
     * @param {String} conversationId - Conversation ID
     * @param {Number} expiresInDays - Days until expiration
     * @param {Number} usageLimit - Maximum usage count
     * @returns {Promise<Object|null>} Updated conversation or null
     */
    async generateJoinLink(conversationId, expiresInDays = 7, usageLimit = null) {
        try {
            const conversation = await this.model.findByIdAndUpdate(
                conversationId,
                {
                    'privacy.joinLink.enabled': true,
                    'privacy.joinLink.token': require('crypto').randomBytes(16).toString('hex'),
                    'privacy.joinLink.expiresAt': new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
                    'privacy.joinLink.usageLimit': usageLimit,
                    'privacy.joinLink.usageCount': 0
                },
                { new: true }
            );
            return conversation;
        } catch (error) {
            logger.error('Error generating join link for conversation', { 
                error: error.message, 
                conversationId,
                expiresInDays,
                usageLimit
            });
            throw error;
        }
    }
    
    /**
     * Get conversation statistics
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} Conversation statistics
     */
    async getStatistics(filters = {}) {
        try {
            const matchStage = { status: 'active', ...filters };
            
            const stats = await this.model.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        byType: {
                            $push: '$type'
                        },
                        byCategory: {
                            $push: '$category'
                        },
                        totalMessages: {
                            $sum: '$messageCount'
                        },
                        totalParticipants: {
                            $sum: { $size: '$participants' }
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
                        byCategory: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byCategory'] },
                                    as: 'category',
                                    in: {
                                        k: '$$category',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byCategory',
                                                    cond: { $eq: ['$$this', '$$category'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        totalMessages: 1,
                        totalParticipants: 1
                    }
                }
            ]);
            
            return stats[0] || { 
                total: 0, 
                byType: {}, 
                byCategory: {},
                totalMessages: 0,
                totalParticipants: 0
            };
        } catch (error) {
            logger.error('Error getting conversation statistics', { 
                error: error.message,
                filters
            });
            throw error;
        }
    }
    
    /**
     * Find conversations with low activity
     * @param {Number} daysInactive - Days since last activity
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Inactive conversations with pagination
     */
    async findInactiveConversations(daysInactive = 30, options = {}) {
        try {
            const cutoffDate = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000);
            
            const result = await this.findMany(
                {
                    lastActivity: { $lt: cutoffDate },
                    status: 'active'
                },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { lastActivity: 1 },
                    select: options.select,
                    populate: options.populate || 'participants.user'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding inactive conversations', { 
                error: error.message,
                daysInactive
            });
            throw error;
        }
    }
    
    /**
     * Find conversations by category
     * @param {String} category - Conversation category
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Conversations with pagination
     */
    async findByCategory(category, options = {}) {
        try {
            const result = await this.findMany(
                { category: category, status: 'active' },
                { 
                    page: options.page || 1,
                    limit: options.limit || 50,
                    sort: options.sort || { lastActivity: -1 },
                    select: options.select,
                    populate: options.populate || 'participants.user lastMessage'
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding conversations by category', { 
                error: error.message, 
                category
            });
            throw error;
        }
    }
    
    /**
     * Update conversation last activity
     * @param {String} conversationId - Conversation ID
     * @returns {Promise<Object|null>} Updated conversation or null
     */
    async updateLastActivity(conversationId) {
        try {
            const conversation = await this.model.findByIdAndUpdate(
                conversationId,
                { lastActivity: new Date() },
                { new: true }
            );
            return conversation;
        } catch (error) {
            logger.error('Error updating conversation last activity', { 
                error: error.message, 
                conversationId
            });
            throw error;
        }
    }
    
    /**
     * Mark conversation as read for user
     * @param {String} conversationId - Conversation ID
     * @param {String} userId - User ID
     * @param {String} messageId - Last read message ID
     * @returns {Promise<Object|null>} Updated conversation or null
     */
    async markAsRead(conversationId, userId, messageId) {
        try {
            const conversation = await this.model.findOneAndUpdate(
                {
                    _id: conversationId,
                    'participants.user': userId,
                    'participants.status': 'active'
                },
                {
                    $set: {
                        'participants.$[elem].settings.lastReadMessage': messageId,
                        'participants.$[elem].settings.lastReadAt': new Date()
                    }
                },
                {
                    new: true,
                    arrayFilters: [{ 'elem.user': userId, 'elem.status': 'active' }]
                }
            );
            return conversation;
        } catch (error) {
            logger.error('Error marking conversation as read', { 
                error: error.message, 
                conversationId,
                userId,
                messageId
            });
            throw error;
        }
    }
}

module.exports = ConversationRepository;