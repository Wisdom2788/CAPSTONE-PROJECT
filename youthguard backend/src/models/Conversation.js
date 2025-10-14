/**
 * Conversation Model - YouthGuard Platform
 * 
 * This model manages conversation contexts for messaging between users.
 * It handles both direct messages and group conversations with comprehensive
 * participant management and conversation settings.
 * 
 * Key Features:
 * - Direct and group conversations
 * - Participant management with roles
 * - Conversation settings and permissions
 * - Message history and archiving
 * - Real-time conversation status
 */

const mongoose = require('mongoose');

/**
 * Participant Schema (Embedded Document)
 * 
 * Manages individual participants within conversations.
 */
const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Participant user is required']
    },
    
    role: {
        type: String,
        enum: {
            values: ['admin', 'moderator', 'member'],
            message: 'Invalid participant role'
        },
        default: 'member'
    },
    
    permissions: {
        canSendMessages: {
            type: Boolean,
            default: true
        },
        
        canAddParticipants: {
            type: Boolean,
            default: false
        },
        
        canRemoveParticipants: {
            type: Boolean,
            default: false
        },
        
        canEditConversation: {
            type: Boolean,
            default: false
        },
        
        canDeleteMessages: {
            type: Boolean,
            default: false
        }
    },
    
    status: {
        type: String,
        enum: ['active', 'muted', 'blocked', 'left'],
        default: 'active'
    },
    
    // Participant-specific settings
    settings: {
        notifications: {
            type: String,
            enum: ['all', 'mentions_only', 'none'],
            default: 'all'
        },
        
        lastReadMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        
        lastReadAt: {
            type: Date,
            default: Date.now
        },
        
        mutedUntil: Date,
        
        customName: String // Custom name for this conversation
    },
    
    joinedAt: {
        type: Date,
        default: Date.now
    },
    
    leftAt: Date,
    
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

/**
 * Conversation Schema
 * 
 * Main conversation document managing all conversation aspects.
 */
const conversationSchema = new mongoose.Schema({
    /**
     * Basic Conversation Information
     */
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Conversation name cannot exceed 100 characters'],
        validate: {
            validator: function(name) {
                // Name is required for group conversations
                if (this.type === 'group') {
                    return name && name.length > 0;
                }
                return true;
            },
            message: 'Group conversations must have a name'
        }
    },
    
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Conversation description cannot exceed 500 characters']
    },
    
    type: {
        type: String,
        enum: {
            values: ['direct', 'group', 'support', 'announcement'],
            message: 'Invalid conversation type'
        },
        required: [true, 'Conversation type is required'],
        index: true
    },
    
    /**
     * Participants Management
     */
    participants: [participantSchema],
    
    // Creator of the conversation
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Conversation creator is required']
    },
    
    /**
     * Conversation Settings
     */
    settings: {
        // Who can add new participants
        whoCanAddParticipants: {
            type: String,
            enum: ['admins_only', 'moderators_and_admins', 'all_members'],
            default: 'admins_only'
        },
        
        // Who can send messages
        whoCanSendMessages: {
            type: String,
            enum: ['all_members', 'moderators_and_admins', 'admins_only'],
            default: 'all_members'
        },
        
        // Message history visibility for new members
        historyVisibility: {
            type: String,
            enum: ['visible', 'hidden_before_join'],
            default: 'hidden_before_join'
        },
        
        // Allow members to leave
        allowMembersToLeave: {
            type: Boolean,
            default: true
        },
        
        // Require approval for new members
        requireApproval: {
            type: Boolean,
            default: false
        },
        
        // Auto-delete messages after certain period
        autoDeleteMessages: {
            enabled: {
                type: Boolean,
                default: false
            },
            afterDays: {
                type: Number,
                min: [1, 'Auto-delete period must be at least 1 day'],
                max: [365, 'Auto-delete period cannot exceed 365 days']
            }
        }
    },
    
    /**
     * Conversation Status and Activity
     */
    status: {
        type: String,
        enum: {
            values: ['active', 'archived', 'deleted', 'suspended'],
            message: 'Invalid conversation status'
        },
        default: 'active',
        index: true
    },
    
    // Last message reference for quick access
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    
    lastActivity: {
        type: Date,
        default: Date.now,
        index: true
    },
    
    // Message statistics
    messageCount: {
        type: Number,
        default: 0,
        min: [0, 'Message count cannot be negative']
    },
    
    /**
     * Conversation Appearance
     */
    appearance: {
        avatar: {
            type: String,
            validate: {
                validator: function(url) {
                    if (!url) return true;
                    return /^https?:\/\//i.test(url);
                },
                message: 'Avatar must be a valid URL'
            }
        },
        
        color: {
            type: String,
            validate: {
                validator: function(color) {
                    if (!color) return true;
                    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
                },
                message: 'Color must be a valid hex color'
            }
        },
        
        theme: {
            type: String,
            enum: ['default', 'dark', 'blue', 'green', 'purple'],
            default: 'default'
        }
    },
    
    /**
     * Privacy and Moderation
     */
    privacy: {
        visibility: {
            type: String,
            enum: ['public', 'private', 'secret'],
            default: 'private'
        },
        
        joinLink: {
            enabled: {
                type: Boolean,
                default: false
            },
            token: String,
            expiresAt: Date,
            usageLimit: Number,
            usageCount: {
                type: Number,
                default: 0
            }
        }
    },
    
    moderation: {
        bannedUsers: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            bannedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            bannedAt: {
                type: Date,
                default: Date.now
            },
            reason: String,
            expiresAt: Date
        }],
        
        mutedUsers: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            mutedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            mutedAt: {
                type: Date,
                default: Date.now
            },
            expiresAt: Date,
            reason: String
        }]
    },
    
    /**
     * Tags and Categories
     */
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    
    category: {
        type: String,
        enum: [
            'general', 'work', 'education', 'support', 'social',
            'project', 'team', 'announcement', 'feedback'
        ]
    },
    
    /**
     * Integration and Metadata
     */
    metadata: {
        // For support conversations
        ticketId: String,
        priority: {
            type: String,
            enum: ['low', 'normal', 'high', 'urgent'],
            default: 'normal'
        },
        
        // For project-related conversations
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        
        // For course-related conversations
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        
        // For job-related conversations
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        },
        
        // External integration data
        externalId: String,
        source: {
            type: String,
            enum: ['platform', 'email', 'imported', 'api']
        }
    }
}, {
    timestamps: true
});

/**
 * Indexes for Performance
 */
conversationSchema.index({ type: 1, status: 1 }); // Type and status filtering
conversationSchema.index({ 'participants.user': 1, lastActivity: -1 }); // User's conversations
conversationSchema.index({ lastActivity: -1 }); // Recent conversations
conversationSchema.index({ status: 1, lastActivity: -1 }); // Active conversations
conversationSchema.index({ createdBy: 1, createdAt: -1 }); // Creator's conversations
conversationSchema.index({ name: 'text', description: 'text' }); // Text search
conversationSchema.index({ 'privacy.visibility': 1 }); // Privacy filtering
conversationSchema.index({ 'metadata.courseId': 1 }); // Course conversations
conversationSchema.index({ 'metadata.jobId': 1 }); // Job conversations

/**
 * Virtual Fields
 */

// Get active participants count
conversationSchema.virtual('activeParticipantsCount').get(function() {
    return this.participants.filter(p => p.status === 'active').length;
});

// Get total participants count (including inactive)
conversationSchema.virtual('totalParticipantsCount').get(function() {
    return this.participants.length;
});

// Check if conversation is a direct message
conversationSchema.virtual('isDirectMessage').get(function() {
    return this.type === 'direct' && this.activeParticipantsCount === 2;
});

// Get conversation admins
conversationSchema.virtual('admins').get(function() {
    return this.participants.filter(p => 
        p.status === 'active' && p.role === 'admin'
    ).map(p => p.user);
});

// Check if conversation has unread messages for any participant
conversationSchema.virtual('hasUnreadMessages').get(function() {
    // This would need to be populated separately
    return false; // Placeholder
});

/**
 * Middleware
 */

// Update lastActivity when saving
conversationSchema.pre('save', function(next) {
    if (this.isModified('participants') || this.isModified('lastMessage')) {
        this.lastActivity = new Date();
    }
    next();
});

// Generate join link token when enabled
conversationSchema.pre('save', function(next) {
    if (this.isModified('privacy.joinLink.enabled') && 
        this.privacy.joinLink.enabled && 
        !this.privacy.joinLink.token) {
        this.privacy.joinLink.token = require('crypto').randomBytes(16).toString('hex');
    }
    next();
});

/**
 * Instance Methods
 */

/**
 * Add a participant to the conversation
 * @param {String} userId - The user ID to add
 * @param {String} addedBy - The user ID who is adding the participant
 * @param {String} role - The role to assign (default: 'member')
 * @returns {Object} The new participant
 */
conversationSchema.methods.addParticipant = function(userId, addedBy, role = 'member') {
    // Check if user is already a participant
    const existingParticipant = this.participants.find(p => 
        p.user.toString() === userId && p.status !== 'left'
    );
    
    if (existingParticipant) {
        throw new Error('User is already a participant in this conversation');
    }
    
    // For direct messages, limit to 2 participants
    if (this.type === 'direct' && this.activeParticipantsCount >= 2) {
        throw new Error('Direct conversations cannot have more than 2 participants');
    }
    
    const participant = {
        user: userId,
        role: role,
        invitedBy: addedBy,
        joinedAt: new Date(),
        status: 'active'
    };
    
    this.participants.push(participant);
    this.lastActivity = new Date();
    
    return participant;
};

/**
 * Remove a participant from the conversation
 * @param {String} userId - The user ID to remove
 * @param {String} removedBy - The user ID who is removing the participant
 * @returns {Boolean} Whether the participant was removed
 */
conversationSchema.methods.removeParticipant = function(userId, removedBy) {
    const participant = this.participants.find(p => 
        p.user.toString() === userId && p.status === 'active'
    );
    
    if (!participant) {
        return false;
    }
    
    participant.status = 'left';
    participant.leftAt = new Date();
    this.lastActivity = new Date();
    
    return true;
};

/**
 * Update participant role
 * @param {String} userId - The user ID
 * @param {String} newRole - The new role
 * @param {String} updatedBy - The user ID who is updating the role
 * @returns {Boolean} Whether the role was updated
 */
conversationSchema.methods.updateParticipantRole = function(userId, newRole, updatedBy) {
    const participant = this.participants.find(p => 
        p.user.toString() === userId && p.status === 'active'
    );
    
    if (!participant) {
        return false;
    }
    
    participant.role = newRole;
    this.lastActivity = new Date();
    
    return true;
};

/**
 * Check if user is a participant
 * @param {String} userId - The user ID to check
 * @returns {Object|null} The participant object or null
 */
conversationSchema.methods.getParticipant = function(userId) {
    return this.participants.find(p => 
        p.user.toString() === userId && p.status === 'active'
    ) || null;
};

/**
 * Check if user can perform an action
 * @param {String} userId - The user ID
 * @param {String} action - The action to check
 * @returns {Boolean} Whether the user can perform the action
 */
conversationSchema.methods.canUserPerformAction = function(userId, action) {
    const participant = this.getParticipant(userId);
    
    if (!participant) {
        return false;
    }
    
    // Check specific permissions
    switch (action) {
        case 'send_messages':
            return participant.permissions.canSendMessages && 
                   this.settings.whoCanSendMessages !== 'none';
                   
        case 'add_participants':
            return participant.permissions.canAddParticipants ||
                   (this.settings.whoCanAddParticipants === 'all_members') ||
                   (this.settings.whoCanAddParticipants === 'moderators_and_admins' && 
                    ['moderator', 'admin'].includes(participant.role)) ||
                   (this.settings.whoCanAddParticipants === 'admins_only' && 
                    participant.role === 'admin');
                   
        case 'remove_participants':
            return participant.permissions.canRemoveParticipants ||
                   ['moderator', 'admin'].includes(participant.role);
                   
        case 'edit_conversation':
            return participant.permissions.canEditConversation ||
                   participant.role === 'admin';
                   
        case 'delete_messages':
            return participant.permissions.canDeleteMessages ||
                   ['moderator', 'admin'].includes(participant.role);
                   
        default:
            return false;
    }
};

/**
 * Mute user in conversation
 * @param {String} userId - The user ID to mute
 * @param {String} mutedBy - The user ID who is muting
 * @param {Date} expiresAt - When the mute expires
 * @param {String} reason - Reason for muting
 * @returns {Boolean} Whether the user was muted
 */
conversationSchema.methods.muteUser = function(userId, mutedBy, expiresAt, reason) {
    // Remove existing mute if any
    this.moderation.mutedUsers = this.moderation.mutedUsers.filter(mu => 
        mu.user.toString() !== userId
    );
    
    // Add new mute
    this.moderation.mutedUsers.push({
        user: userId,
        mutedBy: mutedBy,
        mutedAt: new Date(),
        expiresAt: expiresAt,
        reason: reason
    });
    
    return true;
};

/**
 * Check if user is muted
 * @param {String} userId - The user ID to check
 * @returns {Object|null} The mute object or null
 */
conversationSchema.methods.isUserMuted = function(userId) {
    const mute = this.moderation.mutedUsers.find(mu => 
        mu.user.toString() === userId &&
        (!mu.expiresAt || mu.expiresAt > new Date())
    );
    
    return mute || null;
};

/**
 * Generate join link
 * @param {Number} expiresInDays - How many days the link should be valid
 * @param {Number} usageLimit - Maximum number of uses
 * @returns {String} The join link token
 */
conversationSchema.methods.generateJoinLink = function(expiresInDays = 7, usageLimit = null) {
    this.privacy.joinLink.enabled = true;
    this.privacy.joinLink.token = require('crypto').randomBytes(16).toString('hex');
    this.privacy.joinLink.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    this.privacy.joinLink.usageLimit = usageLimit;
    this.privacy.joinLink.usageCount = 0;
    
    return this.privacy.joinLink.token;
};

/**
 * Mark conversation as read for user
 * @param {String} userId - The user ID
 * @param {String} messageId - The last read message ID
 * @returns {Boolean} Whether the read status was updated
 */
conversationSchema.methods.markAsRead = function(userId, messageId) {
    const participant = this.getParticipant(userId);
    
    if (!participant) {
        return false;
    }
    
    participant.settings.lastReadMessage = messageId;
    participant.settings.lastReadAt = new Date();
    
    return true;
};

/**
 * Static Methods
 */

/**
 * Find conversations for a user
 * @param {String} userId - The user ID
 * @param {Object} filters - Filter options
 * @returns {Array} Array of conversations
 */
conversationSchema.statics.findForUser = function(userId, filters = {}) {
    const query = {
        'participants.user': userId,
        'participants.status': 'active',
        status: 'active'
    };
    
    // Apply filters
    if (filters.type) {
        query.type = filters.type;
    }
    
    if (filters.hasUnread) {
        // This would need a more complex aggregation
        // query.hasUnreadMessages = true;
    }
    
    return this.find(query)
        .populate('participants.user', 'firstName lastName profilePicture')
        .populate('lastMessage', 'content.text sender createdAt')
        .sort({ lastActivity: -1 })
        .limit(filters.limit || 50);
};

/**
 * Create a direct conversation between two users
 * @param {String} userId1 - First user ID
 * @param {String} userId2 - Second user ID
 * @returns {Object} The created conversation
 */
conversationSchema.statics.createDirectConversation = async function(userId1, userId2) {
    // Check if conversation already exists
    const existing = await this.findOne({
        type: 'direct',
        'participants.user': { $all: [userId1, userId2] },
        'participants.status': 'active'
    });
    
    if (existing) {
        return existing;
    }
    
    // Create new direct conversation
    const conversation = new this({
        type: 'direct',
        createdBy: userId1,
        participants: [
            { user: userId1, role: 'admin', status: 'active' },
            { user: userId2, role: 'admin', status: 'active' }
        ]
    });
    
    return conversation.save();
};

/**
 * Find conversations by join link token
 * @param {String} token - The join link token
 * @returns {Object|null} The conversation or null
 */
conversationSchema.statics.findByJoinToken = function(token) {
    return this.findOne({
        'privacy.joinLink.enabled': true,
        'privacy.joinLink.token': token,
        'privacy.joinLink.expiresAt': { $gt: new Date() },
        status: 'active'
    });
};

/**
 * Search conversations
 * @param {String} searchText - Search query
 * @param {Object} filters - Search filters
 * @returns {Array} Array of matching conversations
 */
conversationSchema.statics.searchConversations = function(searchText, filters = {}) {
    const query = {
        $text: { $search: searchText },
        status: 'active'
    };
    
    // Apply filters
    if (filters.type) {
        query.type = filters.type;
    }
    
    if (filters.userId) {
        query['participants.user'] = filters.userId;
        query['participants.status'] = 'active';
    }
    
    if (filters.category) {
        query.category = filters.category;
    }
    
    return this.find(query, { score: { $meta: 'textScore' } })
        .populate('participants.user', 'firstName lastName profilePicture')
        .sort({ score: { $meta: 'textScore' } })
        .limit(filters.limit || 20);
};

// Export the model
module.exports = mongoose.model('Conversation', conversationSchema);