/**
 * Login Data Transfer Object (DTO) - YouthGuard Platform
 * 
 * This DTO handles data transfer for user authentication requests.
 * It ensures only necessary data is provided for login operations.
 */

const BaseDTO = require('./BaseDTO');

/**
 * LoginDTO Class
 * 
 * DTO for user login requests with validation.
 */
class LoginDTO extends BaseDTO {
    /**
     * Constructor
     * @param {Object} data - Login data
     */
    constructor(data = {}) {
        super(data);
        this._validateData();
    }
    
    /**
     * Validate login data
     * @private
     */
    _validateData() {
        const errors = [];
        
        // Validate identifier (email or username)
        if (!this._data.identifier || this._data.identifier.trim().length === 0) {
            errors.push('Email or username is required');
        }
        
        // Validate password
        if (!this._data.password || this._data.password.length === 0) {
            errors.push('Password is required');
        }
        
        if (errors.length > 0) {
            throw new Error(`Validation errors: ${errors.join(', ')}`);
        }
    }
    
    /**
     * Transform DTO for authentication service
     * @returns {Object} Authentication data
     */
    toAuthentication() {
        return {
            identifier: this._data.identifier,
            password: this._data.password
        };
    }
    
    /**
     * Get identifier
     * @returns {String} Identifier (email or username)
     */
    getIdentifier() {
        return this._data.identifier;
    }
    
    /**
     * Get password
     * @returns {String} Password
     */
    getPassword() {
        return this._data.password;
    }
}

module.exports = LoginDTO;