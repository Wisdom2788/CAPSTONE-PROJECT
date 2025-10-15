/**
 * User Service - YouthGuard Platform
 * 
 * This service handles all business logic related to User management.
 * It extends the BaseService and provides user-specific functionality
 * such as authentication, profile management, and account security.
 * 
 * Key Features:
 * - User authentication and authorization
 * - Profile management and updates
 * - Account security and verification
 * - Role and permission management
 * - User search and filtering
 */

const BaseService = require('./BaseService');
const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const UserDTO = require('../dto/UserDTO');
const UserServiceInterface = require('../interfaces/UserServiceInterface');

/**
 * UserService Class
 * 
 * Service for User model with specialized business logic.
 */
class UserService extends BaseService {
    /**
     * Constructor
     */
    constructor() {
        super(new UserRepository());
        this.saltRounds = 10;
    }
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registered user
     */
    async register(userData) {
        try {
            logger.info('Registering new user', { email: userData.email });
            
            // Create UserDTO for validation
            const userDTO = new UserDTO(userData);
            
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
            
            // Prepare user data using DTO transformation
            const user = {
                ...userDTO.toRegistration(),
                password: hashedPassword,
                account: {
                    status: 'active',
                    isEmailVerified: true,
                    createdAt: new Date()
                }
            };
            
            // Create user through repository
            const createdUser = await this.repository.create(user);
            
            logger.info('User registered successfully', { userId: createdUser._id });
            return createdUser;
            
        } catch (error) {
            logger.error('Error registering user', { 
                error: error.message, 
                email: userData.email 
            });
            throw error;
        }
    }
    
    /**
     * Authenticate user
     * @param {String} identifier - Email or username
     * @param {String} password - User password
     * @returns {Promise<Object>} Authentication result with token
     */
    async authenticate(identifier, password) {
        try {
            logger.info('Authenticating user', { identifier });
            
            // Find user by email or username
            const user = await this.repository.findByEmailOrUsername(identifier);
            if (!user) {
                throw new Error('Invalid credentials');
            }
            
            // Check if account is active
            if (user.account.status !== 'active') {
                throw new Error('Account is not active');
            }
            
            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            
            // Create UserDTO for response transformation
            const userDTO = UserDTO.fromModel(user);
            
            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id, 
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // Update last login
            await this.repository.updateLastLogin(user._id);
            
            // Increment login count
            await this.repository.incrementLoginCount(user._id);
            
            logger.info('User authenticated successfully', { userId: user._id });
            
            return {
                user: userDTO.toPublicResponse(),
                token
            };
            
        } catch (error) {
            logger.error('Error authenticating user', { 
                error: error.message, 
                identifier 
            });
            throw error;
        }
    }
    
    /**
     * Update user profile
     * @param {String} userId - User ID
     * @param {Object} profileData - Profile update data
     * @returns {Promise<Object>} Updated user
     */
    async updateProfile(userId, profileData) {
        try {
            logger.info('Updating user profile', { userId });
            
            // Create UserDTO for validation and transformation
            const userDTO = new UserDTO(profileData);
            
            // Prepare update data using DTO transformation
            const updateData = userDTO.toProfileUpdate();
            
            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });
            
            // Update user through repository
            const user = await this.repository.update(userId, updateData);
            
            // Transform response using DTO
            if (user) {
                const responseDTO = UserDTO.fromModel(user);
                logger.info('User profile updated successfully', { userId });
                return responseDTO.toPublicResponse();
            }
            
            logger.info('User not found for profile update', { userId });
            return null;
            
        } catch (error) {
            logger.error('Error updating user profile', { 
                error: error.message, 
                userId 
            });
            throw error;
        }
    }
    
    /**
     * Change user password
     * @param {String} userId - User ID
     * @param {String} currentPassword - Current password
     * @param {String} newPassword - New password
     * @returns {Promise<Boolean>} Whether password was changed
     */
    async changePassword(userId, currentPassword, newPassword) {
        try {
            logger.info('Changing user password', { userId });
            
            // Find user
            const user = await this.repository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            
            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
            
            // Update password
            await this.repository.update(userId, { password: hashedPassword });
            
            logger.info('User password changed successfully', { userId });
            return true;
            
        } catch (error) {
            logger.error('Error changing user password', { 
                error: error.message, 
                userId 
            });
            throw error;
        }
    }
    
    /**
     * Verify user email
     * @param {String} userId - User ID
     * @param {String} token - Verification token
     * @returns {Promise<Boolean>} Whether email was verified
     */
    async verifyEmail(userId, token) {
        try {
            logger.info('Verifying user email', { userId });
            
            // Find user
            const user = await this.repository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Check if already verified
            if (user.account.isEmailVerified) {
                return true;
            }
            
            // Verify token (simplified - in real app, would check against stored token)
            // For now, we'll just mark as verified
            await this.repository.updateEmailVerification(userId, true);
            
            // Update account status
            await this.repository.updateAccountStatus(userId, 'active');
            
            logger.info('User email verified successfully', { userId });
            return true;
            
        } catch (error) {
            logger.error('Error verifying user email', { 
                error: error.message, 
                userId 
            });
            throw error;
        }
    }
    
    /**
     * Search users
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results
     */
    async searchUsers(searchText, options = {}) {
        try {
            logger.info('Searching users', { searchText });
            
            const result = await this.repository.searchUsers(searchText, options);
            
            logger.info('Users search completed', { 
                searchText, 
                count: result.documents.length 
            });
            
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
     * Get user statistics
     * @returns {Promise<Object>} User statistics
     */
    async getStatistics() {
        try {
            logger.info('Getting user statistics');
            
            const stats = await this.repository.getStatistics();
            
            logger.info('User statistics retrieved');
            return stats;
            
        } catch (error) {
            logger.error('Error getting user statistics', { 
                error: error.message 
            });
            throw error;
        }
    }
    
    /**
     * Suspend user account
     * @param {String} userId - User ID
     * @param {String} reason - Reason for suspension
     * @returns {Promise<Object>} Updated user
     */
    async suspendUser(userId, reason) {
        try {
            logger.info('Suspending user account', { userId, reason });
            
            const user = await this.repository.updateAccountStatus(userId, 'suspended', reason);
            
            logger.info('User account suspended', { userId });
            return user;
            
        } catch (error) {
            logger.error('Error suspending user account', { 
                error: error.message, 
                userId,
                reason
            });
            throw error;
        }
    }
    
    /**
     * Activate user account
     * @param {String} userId - User ID
     * @returns {Promise<Object>} Updated user
     */
    async activateUser(userId) {
        try {
            logger.info('Activating user account', { userId });
            
            const user = await this.repository.updateAccountStatus(userId, 'active');
            
            logger.info('User account activated', { userId });
            return user;
            
        } catch (error) {
            logger.error('Error activating user account', { 
                error: error.message, 
                userId
            });
            throw error;
        }
    }
    
    /**
     * Validate create data
     * @protected
     * @param {Object} data - Data to validate
     * @returns {Promise<Object>} Validated data
     */
    async _validateCreateData(data) {
        // Check if email already exists
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        // Check if username already exists (if provided)
        if (data.username) {
            const existingUsername = await this.repository.findByUsername(data.username);
            if (existingUsername) {
                throw new Error('Username already exists');
            }
        }
        
        return data;
    }
    
    /**
     * Transform user entity for output
     * @protected
     * @param {Object} user - User entity
     * @returns {Promise<Object>} Transformed user
     */
    async _transformEntity(user) {
        // Remove sensitive information
        const transformedUser = { ...user.toObject() };
        delete transformedUser.password;
        delete transformedUser.__v;
        
        return transformedUser;
    }
    
    /**
     * Check if user can be deleted
     * @protected
     * @param {Object} user - User entity
     * @returns {Promise<Boolean>} Whether user can be deleted
     */
    async _canDelete(user) {
        // Prevent deletion of admin users
        if (user.role === 'admin') {
            return false;
        }
        
        return true;
    }
}

module.exports = UserService;