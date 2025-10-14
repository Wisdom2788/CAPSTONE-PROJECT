/**
 * Conversation Controller - YouthGuard Platform
 * 
 * This controller handles all HTTP requests related to Conversations.
 * It extends the BaseController and provides conversation-specific API endpoints
 * for conversation creation, participant management, and real-time updates.
 * 
 * Key Features:
 * - Conversation creation and management
 * - Participant management
 * - Conversation search and filtering
 * - Real-time conversation updates
 * - Privacy and moderation management
 */

const BaseController = require('./BaseController');
const ConversationService = require('../services/ConversationService');
const logger = require('../utils/logger');

/**
 * ConversationController Class
 * 
 * Controller for Conversation model with specialized API endpoints.
 */
class ConversationController extends BaseController {
    /**
     * Constructor
     */
    constructor() {
        super(new ConversationService());
    }
    
    /**
     * Create a new conversation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createConversation(req, res, next) {
        try {
            logger.info('Creating new conversation', { createdBy: req.user.id });
            
            // Validate request data
            const validationError = this._validateConversationRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Add creator ID to conversation data
            const conversationData = {
                ...req.body,
                createdBy: req.user.id
            };
            
            // Create conversation through service
            const conversation = await this.service.createConversation(conversationData);
            
            logger.info('Conversation created successfully', { conversationId: conversation._id });
            
            res.status(201).json({
                success: true,
                message: 'Conversation created successfully',
                data: conversation
            });
            
        } catch (error) {
            logger.error('Error creating conversation', { 
                error: error.message,
                createdBy: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Create a direct conversation between two users
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createDirectConversation(req, res, next) {
        try {
            const { userId } = req.body;
            
            logger.info('Creating direct conversation', { 
                userId1: req.user.id, 
                userId2: userId 
            });
            
            // Validate request data
            const validationError = this._validateDirectConversationRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Create direct conversation through service
            const conversation = await this.service.createDirectConversation(
                req.user.id, 
                userId, 
                req.user.id
            );
            
            logger.info('Direct conversation created successfully', { conversationId: conversation._id });
            
            res.status(201).json({
                success: true,
                message: 'Direct conversation created successfully',
                data: conversation
            });
            
        } catch (error) {
            logger.error('Error creating direct conversation', { 
                error: error.message,
                userId1: req.user.id,
                userId2: req.body.userId,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get conversations for user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getConversationsForUser(req, res, next) {
        try {
            logger.info('Getting conversations for user', { userId: req.user.id });
            
            // Parse query parameters
            const options = this._parseOptions(req.query);
            
            // Get conversations through service
            const result = await this.service.getConversationsForUser(req.user.id, options);
            
            logger.info('Conversations retrieved for user', { 
                userId: req.user.id, 
                count: result.documents.length 
            });
            
            res.status(200).json({
                success: true,
                message: 'Conversations retrieved successfully',
                data: result.documents,
                pagination: result.pagination
            });
            
        } catch (error) {
            logger.error('Error getting conversations for user', { 
                error: error.message,
                userId: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get conversation by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getConversation(req, res, next) {
        try {
            const { id } = req.params;
            
            logger.info('Getting conversation by ID', { conversationId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid conversation ID format'
                });
            }
            
            // Get conversation through service
            const conversation = await this.service.findById(id);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }
            
            // Check if user is a participant
            const isParticipant = conversation.participants.some(p => 
                p.user.toString() === req.user.id && p.status === 'active'
            );
            
            if (!isParticipant) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not a participant in this conversation.'
                });
            }
            
            logger.info('Conversation retrieved successfully', { conversationId: id });
            
            res.status(200).json({
                success: true,
                message: 'Conversation retrieved successfully',
                data: conversation
            });
            
        } catch (error) {
            logger.error('Error getting conversation', { 
                error: error.message,
                conversationId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Add participant to conversation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async addParticipant(req, res, next) {
        try {
            const { id } = req.params;
            const { userId, role } = req.body;
            
            logger.info('Adding participant to conversation', { 
                conversationId: id, 
                userId, 
                addedBy: req.user.id 
            });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid conversation ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateParticipantRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Check if user is authorized to add participant
            const conversation = await this.service.findById(id);
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }
            
            const userParticipant = conversation.participants.find(p => 
                p.user.toString() === req.user.id && p.status === 'active'
            );
            
            if (!userParticipant) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not a participant in this conversation.'
                });
            }
            
            // Check permissions based on conversation settings
            const canAdd = this._canAddParticipant(conversation, userParticipant, role);
            if (!canAdd) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not have permission to add participants with this role.'
                });
            }
            
            // Add participant through service
            const updatedConversation = await this.service.addParticipant(
                id, 
                userId, 
                req.user.id, 
                role
            );
            
            logger.info('Participant added to conversation successfully', { 
                conversationId: id, 
                userId, 
                addedBy: req.user.id 
            });
            
            res.status(200).json({
                success: true,
                message: 'Participant added successfully',
                data: updatedConversation
            });
            
        } catch (error) {
            logger.error('Error adding participant to conversation', { 
                error: error.message,
                conversationId: req.params.id,
                userId: req.body.userId,
                addedBy: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Remove participant from conversation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async removeParticipant(req, res, next) {
        try {
            const { id, userId } = req.params;
            
            logger.info('Removing participant from conversation', { 
                conversationId: id, 
                userId, 
                removedBy: req.user.id 
            });
            
            // Validate IDs
            if (!this._isValidId(id) || !this._isValidId(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
            }
            
            // Check if user is authorized to remove participant
            const conversation = await this.service.findById(id);
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }
            
            const userParticipant = conversation.participants.find(p => 
                p.user.toString() === req.user.id && p.status === 'active'
            );
            
            if (!userParticipant) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not a participant in this conversation.'
                });
            }
            
            // Check permissions
            const canRemove = this._canRemoveParticipant(conversation, userParticipant, userId);
            if (!canRemove) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not have permission to remove this participant.'
                });
            }
            
            // Remove participant through service
            const updatedConversation = await this.service.removeParticipant(
                id, 
                userId, 
                req.user.id
            );
            
            logger.info('Participant removed from conversation successfully', { 
                conversationId: id, 
                userId, 
                removedBy: req.user.id 
            });
            
            res.status(200).json({
                success: true,
                message: 'Participant removed successfully',
                data: updatedConversation
            });
            
        } catch (error) {
            logger.error('Error removing participant from conversation', { 
                error: error.message,
                conversationId: req.params.id,
                userId: req.params.userId,
                removedBy: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Update participant role
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateParticipantRole(req, res, next) {
        try {
            const { id, userId } = req.params;
            const { role } = req.body;
            
            logger.info('Updating participant role', { 
                conversationId: id, 
                userId, 
                newRole: role,
                updatedBy: req.user.id 
            });
            
            // Validate IDs
            if (!this._isValidId(id) || !this._isValidId(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
            }
            
            // Validate request data
            const validationError = this._validateRoleUpdateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Check if user is authorized to update participant role
            const conversation = await this.service.findById(id);
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }
            
            const userParticipant = conversation.participants.find(p => 
                p.user.toString() === req.user.id && p.status === 'active'
            );
            
            if (!userParticipant) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not a participant in this conversation.'
                });
            }
            
            // Check permissions
            const canUpdate = this._canUpdateParticipantRole(conversation, userParticipant, userId, role);
            if (!canUpdate) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not have permission to update this participant\'s role.'
                });
            }
            
            // Update participant role through service
            const updatedConversation = await this.service.updateParticipantRole(
                id, 
                userId, 
                role, 
                req.user.id
            );
            
            logger.info('Participant role updated successfully', { 
                conversationId: id, 
                userId, 
                newRole: role,
                updatedBy: req.user.id 
            });
            
            res.status(200).json({
                success: true,
                message: 'Participant role updated successfully',
                data: updatedConversation
            });
            
        } catch (error) {
            logger.error('Error updating participant role', { 
                error: error.message,
                conversationId: req.params.id,
                userId: req.params.userId,
                newRole: req.body.role,
                updatedBy: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Generate join link for conversation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async generateJoinLink(req, res, next) {
        try {
            const { id } = req.params;
            const { expiresInDays, usageLimit } = req.body;
            
            logger.info('Generating join link for conversation', { conversationId: id });
            
            // Validate ID
            if (!this._isValidId(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid conversation ID format'
                });
            }
            
            // Check if user is authorized to generate join link
            const conversation = await this.service.findById(id);
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }
            
            const userParticipant = conversation.participants.find(p => 
                p.user.toString() === req.user.id && p.status === 'active'
            );
            
            if (!userParticipant) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You are not a participant in this conversation.'
                });
            }
            
            // Check if user has permission to generate join link
            const canGenerate = this._canGenerateJoinLink(conversation, userParticipant);
            if (!canGenerate) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not have permission to generate join links for this conversation.'
                });
            }
            
            // Generate join link through service
            const updatedConversation = await this.service.generateJoinLink(
                id, 
                expiresInDays, 
                usageLimit
            );
            
            logger.info('Join link generated successfully', { conversationId: id });
            
            res.status(200).json({
                success: true,
                message: 'Join link generated successfully',
                data: {
                    conversation: updatedConversation,
                    joinLink: `${process.env.APP_URL}/join/${updatedConversation.privacy.joinLink.token}`
                }
            });
            
        } catch (error) {
            logger.error('Error generating join link for conversation', { 
                error: error.message,
                conversationId: req.params.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Join conversation by token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async joinConversationByToken(req, res, next) {
        try {
            const { token } = req.params;
            
            logger.info('Joining conversation by token', { token, userId: req.user.id });
            
            // Join conversation through service
            const conversation = await this.service.joinConversationByToken(token, req.user.id);
            
            logger.info('User joined conversation successfully', { 
                conversationId: conversation._id, 
                userId: req.user.id 
            });
            
            res.status(200).json({
                success: true,
                message: 'Successfully joined conversation',
                data: conversation
            });
            
        } catch (error) {
            logger.error('Error joining conversation by token', { 
                error: error.message,
                token: req.params.token,
                userId: req.user.id,
                stack: error.stack
            });
            
            // Handle specific error cases
            if (error.message === 'Invalid or expired join link' || 
                error.message === 'Join link usage limit exceeded') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Search conversations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async searchConversations(req, res, next) {
        try {
            logger.info('Searching conversations', { 
                query: req.query.q,
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Parse query parameters
            const searchText = req.query.q || '';
            const options = this._parseOptions(req.query);
            
            // Search conversations through service
            const result = await this.service.searchConversations(searchText, options);
            
            logger.info('Conversations search completed', { count: result.documents.length });
            
            res.status(200).json({
                success: true,
                message: 'Conversations search completed',
                data: result.documents,
                pagination: result.pagination
            });
            
        } catch (error) {
            logger.error('Error searching conversations', { 
                error: error.message,
                query: req.query.q,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get conversation statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getStatistics(req, res, next) {
        try {
            logger.info('Getting conversation statistics', { 
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Get statistics through service
            const stats = await this.service.getStatistics();
            
            logger.info('Conversation statistics retrieved');
            
            res.status(200).json({
                success: true,
                message: 'Conversation statistics retrieved',
                data: stats
            });
            
        } catch (error) {
            logger.error('Error getting conversation statistics', { 
                error: error.message,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Check if user can add participant
     * @protected
     * @param {Object} conversation - Conversation object
     * @param {Object} userParticipant - User participant object
     * @param {String} role - Role to assign
     * @returns {Boolean} Whether user can add participant
     */
    _canAddParticipant(conversation, userParticipant, role) {
        // Admins can add anyone
        if (userParticipant.role === 'admin') {
            return true;
        }
        
        // Check conversation settings
        const whoCanAdd = conversation.settings.whoCanAddParticipants;
        
        switch (whoCanAdd) {
            case 'admins_only':
                return userParticipant.role === 'admin';
            case 'moderators_and_admins':
                return ['admin', 'moderator'].includes(userParticipant.role);
            case 'all_members':
                return true;
            default:
                return userParticipant.role === 'admin';
        }
    }
    
    /**
     * Check if user can remove participant
     * @protected
     * @param {Object} conversation - Conversation object
     * @param {Object} userParticipant - User participant object
     * @param {String} targetUserId - Target user ID
     * @returns {Boolean} Whether user can remove participant
     */
    _canRemoveParticipant(conversation, userParticipant, targetUserId) {
        // Cannot remove yourself
        if (targetUserId === userParticipant.user.toString()) {
            return false;
        }
        
        // Admins can remove anyone except other admins
        if (userParticipant.role === 'admin') {
            const targetParticipant = conversation.participants.find(p => 
                p.user.toString() === targetUserId && p.status === 'active'
            );
            
            // Cannot remove other admins
            if (targetParticipant && targetParticipant.role === 'admin') {
                return false;
            }
            
            return true;
        }
        
        // Moderators can remove members
        if (userParticipant.role === 'moderator') {
            const targetParticipant = conversation.participants.find(p => 
                p.user.toString() === targetUserId && p.status === 'active'
            );
            
            // Cannot remove admins or other moderators
            if (targetParticipant && ['admin', 'moderator'].includes(targetParticipant.role)) {
                return false;
            }
            
            return true;
        }
        
        // Regular members cannot remove others
        return false;
    }
    
    /**
     * Check if user can update participant role
     * @protected
     * @param {Object} conversation - Conversation object
     * @param {Object} userParticipant - User participant object
     * @param {String} targetUserId - Target user ID
     * @param {String} newRole - New role
     * @returns {Boolean} Whether user can update participant role
     */
    _canUpdateParticipantRole(conversation, userParticipant, targetUserId, newRole) {
        // Cannot update yourself
        if (targetUserId === userParticipant.user.toString()) {
            return false;
        }
        
        // Only admins can update roles
        if (userParticipant.role !== 'admin') {
            return false;
        }
        
        // Cannot make someone an admin
        if (newRole === 'admin') {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if user can generate join link
     * @protected
     * @param {Object} conversation - Conversation object
     * @param {Object} userParticipant - User participant object
     * @returns {Boolean} Whether user can generate join link
     */
    _canGenerateJoinLink(conversation, userParticipant) {
        // Only admins can generate join links
        return userParticipant.role === 'admin';
    }
    
    /**
     * Validate conversation request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateConversationRequest(req) {
        const { type, name } = req.body;
        
        if (!type) {
            return 'Conversation type is required';
        }
        
        const validTypes = ['direct', 'group', 'support', 'announcement'];
        if (!validTypes.includes(type)) {
            return 'Invalid conversation type';
        }
        
        // Name is required for group conversations
        if (type === 'group' && (!name || name.trim().length === 0)) {
            return 'Group name is required';
        }
        
        return null;
    }
    
    /**
     * Validate direct conversation request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateDirectConversationRequest(req) {
        const { userId } = req.body;
        
        if (!userId) {
            return 'User ID is required';
        }
        
        return null;
    }
    
    /**
     * Validate participant request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateParticipantRequest(req) {
        const { userId, role } = req.body;
        
        if (!userId) {
            return 'User ID is required';
        }
        
        if (!role) {
            return 'Role is required';
        }
        
        const validRoles = ['admin', 'moderator', 'member'];
        if (!validRoles.includes(role)) {
            return 'Invalid role';
        }
        
        return null;
    }
    
    /**
     * Validate role update request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateRoleUpdateRequest(req) {
        const { role } = req.body;
        
        if (!role) {
            return 'Role is required';
        }
        
        const validRoles = ['moderator', 'member'];
        if (!validRoles.includes(role)) {
            return 'Invalid role. Only moderator and member roles can be assigned.';
        }
        
        return null;
    }
}

module.exports = ConversationController;