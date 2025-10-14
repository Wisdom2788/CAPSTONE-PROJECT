/**
 * User Controller - YouthGuard Platform
 * 
 * This controller handles all HTTP requests related to User management.
 * It extends the BaseController and provides user-specific API endpoints
 * for authentication, profile management, and account security.
 * 
 * Key Features:
 * - User registration and authentication
 * - Profile management and updates
 * - Account security and verification
 * - User search and filtering
 * - Role and permission management
 */

const BaseController = require('./BaseController');
const logger = require('../utils/logger');
const RegisterDTO = require('../dto/RegisterDTO');
const LoginDTO = require('../dto/LoginDTO');

/**
 * UserController Class
 * 
 * Controller for User model with specialized API endpoints.
 */
class UserController extends BaseController {
    /**
     * Constructor
     * @param {Object} userService - User service instance (injected)
     */
    constructor(userService) {
        super(userService);
    }
    
    /**
     * Register a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async register(req, res, next) {
        try {
            logger.info('User registration request', { 
                email: req.body.email,
                ip: req.ip
            });
            
            // Create RegisterDTO to validate and transform data
            const registerDTO = new RegisterDTO(req.body);
            
            // Register user through service
            const user = await this.service.register(registerDTO.getRegistrationData());
            
            logger.info('User registered successfully', { userId: user._id });
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email for verification.',
                data: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
            
        } catch (error) {
            logger.error('Error registering user', { 
                error: error.message,
                email: req.body.email,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Authenticate user (login)
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async login(req, res, next) {
        try {
            logger.info('User login request', { 
                identifier: req.body.identifier,
                ip: req.ip
            });
            
            // Create LoginDTO to validate and transform data
            const loginDTO = new LoginDTO(req.body);
            
            // Authenticate user through service
            const authResult = await this.service.authenticate(
                loginDTO.getIdentifier(), 
                loginDTO.getPassword()
            );
            
            logger.info('User authenticated successfully', { userId: authResult.user.id });
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: authResult
            });
            
        } catch (error) {
            logger.error('Error authenticating user', { 
                error: error.message,
                identifier: req.body.identifier,
                stack: error.stack
            });
            
            // Return 401 for authentication errors
            if (error.message === 'Invalid credentials' || error.message === 'Account is not active') {
                return res.status(401).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get current user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getProfile(req, res, next) {
        try {
            logger.info('Getting user profile', { userId: req.user.id });
            
            // Get user through service
            const user = await this.service.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            logger.info('User profile retrieved successfully', { userId: req.user.id });
            
            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: user
            });
            
        } catch (error) {
            logger.error('Error getting user profile', { 
                error: error.message,
                userId: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Update user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateProfile(req, res, next) {
        try {
            logger.info('Updating user profile', { userId: req.user.id });
            
            // Validate request data
            const validationError = this._validateProfileUpdateRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Update profile through service
            const user = await this.service.updateProfile(req.user.id, req.body);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            logger.info('User profile updated successfully', { userId: req.user.id });
            
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
            
        } catch (error) {
            logger.error('Error updating user profile', { 
                error: error.message,
                userId: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Change user password
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async changePassword(req, res, next) {
        try {
            logger.info('Changing user password', { userId: req.user.id });
            
            // Validate request data
            const validationError = this._validatePasswordChangeRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Change password through service
            const success = await this.service.changePassword(
                req.user.id, 
                req.body.currentPassword, 
                req.body.newPassword
            );
            
            if (!success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to change password'
                });
            }
            
            logger.info('User password changed successfully', { userId: req.user.id });
            
            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });
            
        } catch (error) {
            logger.error('Error changing user password', { 
                error: error.message,
                userId: req.user.id,
                stack: error.stack
            });
            
            // Return 400 for password validation errors
            if (error.message === 'Current password is incorrect') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Verify user email
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async verifyEmail(req, res, next) {
        try {
            logger.info('Verifying user email', { userId: req.user.id });
            
            // Validate request data
            const validationError = this._validateEmailVerificationRequest(req);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: validationError
                });
            }
            
            // Verify email through service
            const success = await this.service.verifyEmail(req.user.id, req.body.token);
            
            if (!success) {
                return res.status(400).json({
                    success: false,
                    message: 'Email verification failed'
                });
            }
            
            logger.info('User email verified successfully', { userId: req.user.id });
            
            res.status(200).json({
                success: true,
                message: 'Email verified successfully'
            });
            
        } catch (error) {
            logger.error('Error verifying user email', { 
                error: error.message,
                userId: req.user.id,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Search users
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async searchUsers(req, res, next) {
        try {
            logger.info('Searching users', { 
                query: req.query.q,
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Parse query parameters
            const searchText = req.query.q || '';
            const options = this._parseOptions(req.query);
            
            // Search users through service
            const result = await this.service.searchUsers(searchText, options);
            
            logger.info('Users search completed', { count: result.documents.length });
            
            res.status(200).json({
                success: true,
                message: 'Users search completed',
                data: result.documents,
                pagination: result.pagination
            });
            
        } catch (error) {
            logger.error('Error searching users', { 
                error: error.message,
                query: req.query.q,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Get user statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getStatistics(req, res, next) {
        try {
            logger.info('Getting user statistics', { 
                user: req.user ? req.user.id : 'anonymous'
            });
            
            // Get statistics through service
            const stats = await this.service.getStatistics();
            
            logger.info('User statistics retrieved');
            
            res.status(200).json({
                success: true,
                message: 'User statistics retrieved',
                data: stats
            });
            
        } catch (error) {
            logger.error('Error getting user statistics', { 
                error: error.message,
                stack: error.stack
            });
            
            next(this._handleControllerError(error));
        }
    }
    
    /**
     * Validate registration request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateRegistrationRequest(req) {
        const { firstName, lastName, email, password } = req.body;
        
        if (!firstName || firstName.trim().length === 0) {
            return 'First name is required';
        }
        
        if (!lastName || lastName.trim().length === 0) {
            return 'Last name is required';
        }
        
        if (!email || email.trim().length === 0) {
            return 'Email is required';
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        }
        
        if (!password || password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        
        return null;
    }
    
    /**
     * Validate login request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateLoginRequest(req) {
        const { identifier, password } = req.body;
        
        if (!identifier || identifier.trim().length === 0) {
            return 'Email or username is required';
        }
        
        if (!password || password.length === 0) {
            return 'Password is required';
        }
        
        return null;
    }
    
    /**
     * Validate profile update request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateProfileUpdateRequest(req) {
        // Optional validation - all fields are optional for profile update
        return null;
    }
    
    /**
     * Validate password change request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validatePasswordChangeRequest(req) {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || currentPassword.length === 0) {
            return 'Current password is required';
        }
        
        if (!newPassword || newPassword.length < 6) {
            return 'New password must be at least 6 characters long';
        }
        
        if (currentPassword === newPassword) {
            return 'New password must be different from current password';
        }
        
        return null;
    }
    
    /**
     * Validate email verification request
     * @protected
     * @param {Object} req - Express request object
     * @returns {String|null} Validation error message or null
     */
    _validateEmailVerificationRequest(req) {
        const { token } = req.body;
        
        if (!token || token.trim().length === 0) {
            return 'Verification token is required';
        }
        
        return null;
    }
}

module.exports = UserController;