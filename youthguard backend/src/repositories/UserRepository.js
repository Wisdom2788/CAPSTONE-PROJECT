/**
 * User Repository - YouthGuard Platform
 * 
 * This repository handles all database operations for User documents.
 * It extends the BaseRepository and provides user-specific functionality
 * such as authentication, role management, and user search.
 * 
 * Key Features:
 * - User authentication and verification
 * - Role and permission management
 * - User search and filtering
 * - Account status management
 * - Profile update operations
 */

const BaseRepository = require('./BaseRepository');
const User = require('../models/User');
const logger = require('../utils/logger');
const UserRepositoryInterface = require('../interfaces/UserRepositoryInterface');

/**
 * UserRepository Class
 * 
 * Repository for User model with specialized operations.
 */
class UserRepository extends BaseRepository {
    /**
     * Constructor
     */
    constructor() {
        super(User);
    }
    
    /**
     * Find user by email
     * @param {String} email - User email
     * @returns {Promise<Object|null>} User document or null
     */
    async findByEmail(email) {
        try {
            const user = await this.model.findOne({ email: email.toLowerCase() });
            return user;
        } catch (error) {
            logger.error('Error finding user by email', { 
                error: error.message, 
                email 
            });
            throw error;
        }
    }
    
    /**
     * Find user by username
     * @param {String} username - Username
     * @returns {Promise<Object|null>} User document or null
     */
    async findByUsername(username) {
        try {
            const user = await this.model.findOne({ username: username.toLowerCase() });
            return user;
        } catch (error) {
            logger.error('Error finding user by username', { 
                error: error.message, 
                username 
            });
            throw error;
        }
    }
    
    /**
     * Find user by email or username
     * @param {String} identifier - Email or username
     * @returns {Promise<Object|null>} User document or null
     */
    async findByEmailOrUsername(identifier) {
        try {
            const user = await this.model.findOne({
                $or: [
                    { email: identifier.toLowerCase() },
                    { username: identifier.toLowerCase() }
                ]
            });
            return user;
        } catch (error) {
            logger.error('Error finding user by email or username', { 
                error: error.message, 
                identifier 
            });
            throw error;
        }
    }
    
    /**
     * Find users by role
     * @param {String} role - User role
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Users with pagination
     */
    async findByRole(role, options = {}) {
        try {
            const result = await this.findMany(
                { role },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding users by role', { 
                error: error.message, 
                role 
            });
            throw error;
        }
    }
    
    /**
     * Find users by status
     * @param {String} status - Account status
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Users with pagination
     */
    async findByStatus(status, options = {}) {
        try {
            const result = await this.findMany(
                { 'account.status': status },
                { 
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { createdAt: -1 },
                    select: options.select
                }
            );
            return result;
        } catch (error) {
            logger.error('Error finding users by status', { 
                error: error.message, 
                status 
            });
            throw error;
        }
    }
    
    /**
     * Search users by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchUsers(searchText, options = {}) {
        try {
            const searchCriteria = {
                $text: { $search: searchText },
                ...options.criteria
            };
            
            const result = await this.findMany(
                searchCriteria,
                {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: { score: { $meta: 'textScore' } },
                    select: options.select
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error searching users', { 
                error: error.message, 
                searchText 
            });
            throw error;
        }
    }
    
    /**
     * Update user's last login time
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Updated user or null
     */
    async updateLastLogin(userId) {
        try {
            const user = await this.update(userId, {
                'account.lastLogin': new Date()
            });
            return user;
        } catch (error) {
            logger.error('Error updating user last login', { 
                error: error.message, 
                userId 
            });
            throw error;
        }
    }
    
    /**
     * Update user's email verification status
     * @param {String} userId - User ID
     * @param {Boolean} verified - Verification status
     * @returns {Promise<Object|null>} Updated user or null
     */
    async updateEmailVerification(userId, verified = true) {
        try {
            const user = await this.update(userId, {
                'account.isEmailVerified': verified,
                'account.emailVerifiedAt': verified ? new Date() : null
            });
            return user;
        } catch (error) {
            logger.error('Error updating user email verification', { 
                error: error.message, 
                userId,
                verified
            });
            throw error;
        }
    }
    
    /**
     * Update user's account status
     * @param {String} userId - User ID
     * @param {String} status - New status
     * @param {String} reason - Reason for status change
     * @returns {Promise<Object|null>} Updated user or null
     */
    async updateAccountStatus(userId, status, reason = '') {
        try {
            const updateData = {
                'account.status': status,
                'account.statusHistory': {
                    status: status,
                    changedAt: new Date(),
                    reason: reason
                }
            };
            
            // Add status-specific timestamps
            if (status === 'suspended') {
                updateData['account.suspendedAt'] = new Date();
            } else if (status === 'active') {
                updateData['account.activatedAt'] = new Date();
            }
            
            const user = await this.update(userId, updateData);
            return user;
        } catch (error) {
            logger.error('Error updating user account status', { 
                error: error.message, 
                userId,
                status,
                reason
            });
            throw error;
        }
    }
    
    /**
     * Increment user's login count
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Updated user or null
     */
    async incrementLoginCount(userId) {
        try {
            const user = await this.model.findByIdAndUpdate(
                userId,
                { $inc: { 'account.loginCount': 1 } },
                { new: true }
            );
            return user;
        } catch (error) {
            logger.error('Error incrementing user login count', { 
                error: error.message, 
                userId 
            });
            throw error;
        }
    }
    
    /**
     * Add role to user
     * @param {String} userId - User ID
     * @param {String} role - Role to add
     * @returns {Promise<Object|null>} Updated user or null
     */
    async addRole(userId, role) {
        try {
            const user = await this.model.findByIdAndUpdate(
                userId,
                { $addToSet: { roles: role } },
                { new: true }
            );
            return user;
        } catch (error) {
            logger.error('Error adding role to user', { 
                error: error.message, 
                userId,
                role
            });
            throw error;
        }
    }
    
    /**
     * Remove role from user
     * @param {String} userId - User ID
     * @param {String} role - Role to remove
     * @returns {Promise<Object|null>} Updated user or null
     */
    async removeRole(userId, role) {
        try {
            const user = await this.model.findByIdAndUpdate(
                userId,
                { $pull: { roles: role } },
                { new: true }
            );
            return user;
        } catch (error) {
            logger.error('Error removing role from user', { 
                error: error.message, 
                userId,
                role
            });
            throw error;
        }
    }
    
    /**
     * Get user statistics
     * @returns {Promise<Object>} User statistics
     */
    async getStatistics() {
        try {
            const stats = await this.model.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        byRole: {
                            $push: '$role'
                        },
                        byStatus: {
                            $push: '$account.status'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        byRole: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byRole'] },
                                    as: 'role',
                                    in: {
                                        k: '$$role',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byRole',
                                                    cond: { $eq: ['$$this', '$$role'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        byStatus: {
                            $arrayToObject: {
                                $map: {
                                    input: { $setUnion: ['$byStatus'] },
                                    as: 'status',
                                    in: {
                                        k: '$$status',
                                        v: {
                                            $size: {
                                                $filter: {
                                                    input: '$byStatus',
                                                    cond: { $eq: ['$$this', '$$status'] }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]);
            
            return stats[0] || { total: 0, byRole: {}, byStatus: {} };
        } catch (error) {
            logger.error('Error getting user statistics', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Find users who haven't logged in for a specified period
     * @param {Number} days - Number of days since last login
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Inactive users with pagination
     */
    async findInactiveUsers(days = 30, options = {}) {
        try {
            const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            
            const result = await this.findMany(
                {
                    'account.lastLogin': { $lt: cutoffDate },
                    'account.status': 'active'
                },
                {
                    page: options.page || 1,
                    limit: options.limit || 20,
                    sort: options.sort || { 'account.lastLogin': 1 },
                    select: options.select || 'firstName lastName email account.lastLogin'
                }
            );
            
            return result;
        } catch (error) {
            logger.error('Error finding inactive users', { 
                error: error.message,
                days
            });
            throw error;
        }
    }
}

module.exports = UserRepository;