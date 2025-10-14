/**
 * User Repository Interface - YouthGuard Platform
 * 
 * This interface defines the contract for UserRepository.
 * It extends the base RepositoryInterface and adds user-specific methods.
 */

const RepositoryInterface = require('./RepositoryInterface');

/**
 * UserRepositoryInterface
 * 
 * Interface that UserRepository should implement.
 */
class UserRepositoryInterface extends RepositoryInterface {
    /**
     * Find user by email
     * @param {String} email - User email
     * @returns {Promise<Object|null>} User document or null
     */
    async findByEmail(email) {
        throw new Error('Method not implemented: findByEmail');
    }
    
    /**
     * Find user by username
     * @param {String} username - Username
     * @returns {Promise<Object|null>} User document or null
     */
    async findByUsername(username) {
        throw new Error('Method not implemented: findByUsername');
    }
    
    /**
     * Find user by email or username
     * @param {String} identifier - Email or username
     * @returns {Promise<Object|null>} User document or null
     */
    async findByEmailOrUsername(identifier) {
        throw new Error('Method not implemented: findByEmailOrUsername');
    }
    
    /**
     * Find users by role
     * @param {String} role - User role
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Users with pagination
     */
    async findByRole(role, options = {}) {
        throw new Error('Method not implemented: findByRole');
    }
    
    /**
     * Find users by status
     * @param {String} status - Account status
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Users with pagination
     */
    async findByStatus(status, options = {}) {
        throw new Error('Method not implemented: findByStatus');
    }
    
    /**
     * Search users by text
     * @param {String} searchText - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Object>} Search results with pagination
     */
    async searchUsers(searchText, options = {}) {
        throw new Error('Method not implemented: searchUsers');
    }
    
    /**
     * Update user's last login time
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Updated user or null
     */
    async updateLastLogin(userId) {
        throw new Error('Method not implemented: updateLastLogin');
    }
    
    /**
     * Update user's email verification status
     * @param {String} userId - User ID
     * @param {Boolean} verified - Verification status
     * @returns {Promise<Object|null>} Updated user or null
     */
    async updateEmailVerification(userId, verified = true) {
        throw new Error('Method not implemented: updateEmailVerification');
    }
    
    /**
     * Update user's account status
     * @param {String} userId - User ID
     * @param {String} status - New status
     * @param {String} reason - Reason for status change
     * @returns {Promise<Object|null>} Updated user or null
     */
    async updateAccountStatus(userId, status, reason = '') {
        throw new Error('Method not implemented: updateAccountStatus');
    }
    
    /**
     * Increment user's login count
     * @param {String} userId - User ID
     * @returns {Promise<Object|null>} Updated user or null
     */
    async incrementLoginCount(userId) {
        throw new Error('Method not implemented: incrementLoginCount');
    }
    
    /**
     * Add role to user
     * @param {String} userId - User ID
     * @param {String} role - Role to add
     * @returns {Promise<Object|null>} Updated user or null
     */
    async addRole(userId, role) {
        throw new Error('Method not implemented: addRole');
    }
    
    /**
     * Remove role from user
     * @param {String} userId - User ID
     * @param {String} role - Role to remove
     * @returns {Promise<Object|null>} Updated user or null
     */
    async removeRole(userId, role) {
        throw new Error('Method not implemented: removeRole');
    }
    
    /**
     * Get user statistics
     * @returns {Promise<Object>} User statistics
     */
    async getStatistics() {
        throw new Error('Method not implemented: getStatistics');
    }
    
    /**
     * Find users who haven't logged in for a specified period
     * @param {Number} days - Number of days since last login
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Inactive users with pagination
     */
    async findInactiveUsers(days = 30, options = {}) {
        throw new Error('Method not implemented: findInactiveUsers');
    }
}

module.exports = UserRepositoryInterface;