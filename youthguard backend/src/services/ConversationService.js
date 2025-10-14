/**
 * Conversation Service - YouthGuard Platform
 * 
 * This service handles all business logic related to Conversations.
 * It extends the BaseService and provides conversation-specific functionality
 * such as conversation creation, participant management, and real-time updates.
 * 
 * Key Features:
 * - Conversation creation and management
 * - Participant management
 * - Conversation search and filtering
 * - Real-time conversation updates
 * - Privacy and moderation management
 */

const BaseService = require('./BaseService');
const ConversationRepository = require('../repositories/ConversationRepository');
const logger = require('../utils/logger');

/**
 * ConversationService Class
 * 
 * Service for Conversation model with specialized business logic.
 */
class ConversationService extends BaseService {
    /**
     * Constructor
     */
    constructor() {
        super(new ConversationRepository());
    }
    
    /**
     * Create a new conversation
     * @param {Object} conversationData - Conversation data
     * @returns {Promise<Object>} Created conversation
     */
    async createConversation(conversationData) {
        try {
            logger.info('Creating new conversation', { 
                type: conversationData.type,
                createdBy: conversationData.createdBy
            });
            
            // Prepare conversation data
            const conversation = {
                name: conversationData.name,
                description: conversationData.description,
                type: conversationData.type,
                participants: conversationData.participants || [],
                createdBy: conversationData.createdBy,
                settings: conversationData.settings || {},
                appearance: conversationData.appearance || {},
                privacy: conversationData.privacy || {},
                category: conversationData.category,
                metadata: conversationData.metadata || {}
            };
            
            // Add creator as admin for group conversations
            if (conversation.type === 'group' && conversation.createdBy) {
                const creatorExists = conversation.participants.some(p => 
                    p.user.toString() === conversation.createdBy.toString()
                );
                
                if (!creatorExists) {
                    conversation.participants.push({
                        user: conversation.createdBy,
                        role: 'admin',
                        status: 'active'
                    });
                }
            }
            
            // Create conversation through repository
            const createdConversation = await this.repository.create(conversation);
            
            logger.info('Conversation created successfully', { conversationId: createdConversation._id });
            return createdConversation;
            
        } catch (error) {
            logger.error('Error creating conversation', { 
                error: error.message, 
                type: conversationData.type,
                createdBy: conversationData.createdBy
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
            logger.info('Creating direct conversation', { userId1, userId2, createdBy });
            
            const conversation = await this.repository.createDirectConversation(userId1, userId2, createdBy);
            
            logger.info('Direct conversation created successfully', { conversationId: conversation._id });
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
     * Get conversations for a user
     * @param {String} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Conversations with pagination
     */
    async getConversationsForUser(userId, options = {}) {
        try {
            logger.info('Getting conversations for user', { userId });
            
            const result = await this.repository.findForUser(userId, options);
            
            logger.info('Conversations retrieved for user', { 
                userId, 
                count: result.documents.length 
            });
            
            return result;
            
        } catch (error) {
            logger.error('Error getting conversations for user', { 
                error: error.message, 
                userId
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
     * @returns {Promise<Object>} Updated conversation
     */
    async addParticipant(conversationId, userId, addedBy, role = 'member') {
        try {
            logger.info('Adding participant to conversation', { 
                conversationId, 
                userId, 
                addedBy, 
                role 
            });
            
            const conversation = await this.repository.addParticipant(conversationId, userId, addedBy, role);
            
            logger.info('Participant added to conversation successfully', { 
                conversationId, 
                userId 
            });
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
     * @returns {Promise<Object>} Updated conversation
     */
    async removeParticipant(conversationId, userId, removedBy) {
        try {
            logger.info('Removing participant from conversation', { 
                conversationId, 
                userId, 
                removedBy 
            });
            
            const conversation = await this.repository.removeParticipant(conversationId, userId, removedBy);
            
            logger.info('Participant removed from conversation successfully', { 
                conversationId, 
                userId 
            });
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
     * @returns {Promise<Object>} Updated conversation
     */
    async updateParticipantRole(conversationId, userId, newRole, updatedBy) {
        try {
            logger.info('Updating participant role', { 
                conversationId, 
                userId, 
                newRole, 
                updatedBy 
            });
            
            const conversation = await this.repository.updateParticipantRole(
                conversationId, 
                userId, 
                newRole, 
                updatedBy
            );
            
            logger.info('Participant role updated successfully', { 
                conversationId, 
                userId, 
                newRole 
            });
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
     * Generate join link for conversation
     * @param {String} conversationId - Conversation ID
     * @param {Number} expiresInDays - Days until expiration
     * @param {Number} usageLimit - Maximum usage count
     * @returns {Promise<Object>} Updated conversation
     */
    async generateJoinLink(conversationId, expiresInDays = 7, usageLimit = null) {
        try {
            logger.info('Generating join link for conversation', { 
                conversationId, 
                expiresInDays, 
                usageLimit 
            });
            
            const conversation = await this.repository.generateJoinLink(
                conversationId, 
                expiresInDays, 
                usageLimit
            );
            
            logger.info('Join link generated successfully', { conversationId });
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
     * Join conversation using token
     * @param {String} token - Join token
     * @param {String} userId - User ID joining
     * @returns {Promise<Object>} Updated conversation
     */
    async joinConversationByToken(token, userId) {
        try {
            logger.info('Joining conversation by token', { token, userId });
            
            // Find conversation by token
            const conversation = await this.repository.findByJoinToken(token);
            if (!conversation) {
                throw new Error('Invalid or expired join link');
            }
            
            // Check if user is already a participant
            const isParticipant = conversation.participants.some(p => 
                p.user.toString() === userId.toString() && p.status === 'active'
            );
            
            if (isParticipant) {
                return conversation;
            }
            
            // Check usage limit
            if (conversation.privacy.joinLink.usageLimit && 
                conversation.privacy.joinLink.usageCount >= conversation.privacy.joinLink.usageLimit) {
                throw new Error('Join link usage limit exceeded');
            }
            
            // Add participant
            const updatedConversation = await this.repository.addParticipant(
                conversation._id, 
                userId, 
                'system', 
                'member'
            );
            
            // Update usage count
            if (updatedConversation) {
                await this.repository.update(
                    conversation._id, 
                    { 'privacy.joinLink.usageCount': conversation.privacy.joinLink.usageCount + 1 }
                );
            }
            
            logger.info('User joined conversation successfully', { 
                conversationId: conversation._id, 
                userId 
            });
            return updatedConversation;
            
        } catch (error) {
            logger.error('Error joining conversation by token', { 
                error: error.message, 
                token,
                userId
            });
            throw error;
        }
    }
    
    /**
     * Search conversations
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results
     */
    async searchConversations(searchText, options = {}) {
        try {
            logger.info('Searching conversations', { searchText });
            
            const result = await this.repository.searchConversations(searchText, options);
            
            logger.info('Conversations search completed', { 
                searchText, 
                count: result.documents.length 
            });
            
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
     * Get conversation statistics
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} Conversation statistics
     */
    async getStatistics(filters = {}) {
        try {
            logger.info('Getting conversation statistics');
            
            const stats = await this.repository.getStatistics(filters);
            
            logger.info('Conversation statistics retrieved');
            return stats;
            
        } catch (error) {
            logger.error('Error getting conversation statistics', { 
                error: error.message,
                filters
            });
            throw error;
        }
    }
    
    /**
     * Find inactive conversations
     * @param {Number} daysInactive - Days since last activity
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Inactive conversations
     */
    async findInactiveConversations(daysInactive = 30, options = {}) {
        try {
            logger.info('Finding inactive conversations', { daysInactive });
            
            const result = await this.repository.findInactiveConversations(daysInactive, options);
            
            logger.info('Inactive conversations search completed', { 
                daysInactive,
                count: result.documents.length 
            });
            
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
     * Update conversation last activity
     * @param {String} conversationId - Conversation ID
     * @returns {Promise<Object>} Updated conversation
     */
    async updateLastActivity(conversationId) {
        try {
            logger.debug('Updating conversation last activity', { conversationId });
            
            const conversation = await this.repository.updateLastActivity(conversationId);
            
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
     * @returns {Promise<Object>} Updated conversation
     */
    async markAsRead(conversationId, userId, messageId) {
        try {
            logger.info('Marking conversation as read', { conversationId, userId, messageId });
            
            const conversation = await this.repository.markAsRead(conversationId, userId, messageId);
            
            logger.info('Conversation marked as read successfully', { conversationId, userId });
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
    
    /**
     * Transform conversation entity for output
     * @protected
     * @param {Object} conversation - Conversation entity
     * @returns {Promise<Object>} Transformed conversation
     */
    async _transformEntity(conversation) {
        // Remove sensitive information if any
        const transformedConversation = { ...conversation.toObject() };
        delete transformedConversation.__v;
        
        // Remove join link token for security
        if (transformedConversation.privacy && transformedConversation.privacy.joinLink) {
            delete transformedConversation.privacy.joinLink.token;
        }
        
        return transformedConversation;
    }
}

module.exports = ConversationService;