/**
 * User Service Interface - YouthGuard Platform
 * 
 * This interface defines the contract for UserService.
 * It extends the base ServiceInterface and adds user-specific methods.
 */

const ServiceInterface = require('./ServiceInterface');

/**
 * UserServiceInterface
 * 
 * Interface that UserService should implement.
 */
class UserServiceInterface extends ServiceInterface {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registered user
     */
    async register(userData) {
        throw new Error('Method not implemented: register');
    }
    
    /**
     * Authenticate user
     * @param {String} identifier - Email or username
     * @param {String} password - User password
     * @returns {Promise<Object>} Authentication result with token
     */
    async authenticate(identifier, password) {
        throw new Error('Method not implemented: authenticate');
    }
    
    /**
     * Update user profile
     * @param {String} userId - User ID
     * @param {Object} profileData - Profile update data
     * @returns {Promise<Object>} Updated user
     */
    async updateProfile(userId, profileData) {
        throw new Error('Method not implemented: updateProfile');
    }
    
    /**
     * Change user password
     * @param {String} userId - User ID
     * @param {String} currentPassword - Current password
     * @param {String} newPassword - New password
     * @returns {Promise<Boolean>} Whether password was changed
     */
    async changePassword(userId, currentPassword, newPassword) {
        throw new Error('Method not implemented: changePassword');
    }
    
    /**
     * Verify user email
     * @param {String} userId - User ID
     * @param {String} token - Verification token
     * @returns {Promise<Boolean>} Whether email was verified
     */
    async verifyEmail(userId, token) {
        throw new Error('Method not implemented: verifyEmail');
    }
    
    /**
     * Search users
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results
     */
    async searchUsers(searchText, options = {}) {
        throw new Error('Method not implemented: searchUsers');
    }
    
    /**
     * Get user statistics
     * @returns {Promise<Object>} User statistics
     */
    async getStatistics() {
        throw new Error('Method not implemented: getStatistics');
    }
    
    /**
     * Suspend user account
     * @param {String} userId - User ID
     * @param {String} reason - Reason for suspension
     * @returns {Promise<Object>} Updated user
     */
    async suspendUser(userId, reason) {
        throw new Error('Method not implemented: suspendUser');
    }
    
    /**
     * Activate user account
     * @param {String} userId - User ID
     * @returns {Promise<Object>} Updated user
     */
    async activateUser(userId) {
        throw new Error('Method not implemented: activateUser');
    }
}

module.exports = UserServiceInterface;