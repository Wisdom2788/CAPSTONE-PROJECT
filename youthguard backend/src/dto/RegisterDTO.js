/**
 * Register Data Transfer Object (DTO) - YouthGuard Platform
 * 
 * This DTO handles data transfer for user registration requests.
 * It ensures all required data is provided for account creation.
 */

const BaseDTO = require('./BaseDTO');

/**
 * RegisterDTO Class
 * 
 * DTO for user registration requests with validation.
 */
class RegisterDTO extends BaseDTO {
    /**
     * Constructor
     * @param {Object} data - Registration data
     */
    constructor(data = {}) {
        super(data);
        this._validateData();
    }
    
    /**
     * Validate registration data
     * @private
     */
    _validateData() {
        const errors = [];
        
        // Validate required fields
        if (!this._data.firstName || this._data.firstName.trim().length === 0) {
            errors.push('First name is required');
        }
        
        if (!this._data.lastName || this._data.lastName.trim().length === 0) {
            errors.push('Last name is required');
        }
        
        if (!this._data.email || this._data.email.trim().length === 0) {
            errors.push('Email is required');
        }
        
        if (!this._data.phoneNumber || this._data.phoneNumber.trim().length === 0) {
            errors.push('Phone number is required');
        }
        
        if (!this._data.dateOfBirth) {
            errors.push('Date of birth is required');
        }
        
        if (!this._data.gender) {
            errors.push('Gender is required');
        }
        
        if (!this._data.location || !this._data.location.state) {
            errors.push('State is required');
        }
        
        if (!this._data.location || !this._data.location.city) {
            errors.push('City is required');
        }
        
        if (!this._data.password || this._data.password.length === 0) {
            errors.push('Password is required');
        }
        
        // Validate email format
        if (this._data.email && !this._isValidEmail(this._data.email)) {
            errors.push('Invalid email format');
        }
        
        // Validate phone number format
        if (this._data.phoneNumber && !this._isValidPhoneNumber(this._data.phoneNumber)) {
            errors.push('Invalid phone number format');
        }
        
        // Validate date of birth
        if (this._data.dateOfBirth && !this._isValidDate(this._data.dateOfBirth)) {
            errors.push('Invalid date of birth');
        } else if (this._data.dateOfBirth && !this._isMinimumAge(this._data.dateOfBirth)) {
            errors.push('Must be at least 16 years old');
        }
        
        // Validate gender
        if (this._data.gender && !['male', 'female', 'other'].includes(this._data.gender)) {
            errors.push('Invalid gender value');
        }
        
        // Validate password strength
        if (this._data.password && !this._isStrongPassword(this._data.password)) {
            errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
        }
        
        // Validate location
        if (this._data.location && this._data.location.state) {
            const validStates = [
                'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
                'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
                'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
                'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
                'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
                'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
            ];
            
            if (!validStates.includes(this._data.location.state)) {
                errors.push('Invalid state');
            }
        }
        
        if (errors.length > 0) {
            throw new Error(`Validation errors: ${errors.join(', ')}`);
        }
    }
    
    /**
     * Validate email format
     * @private
     * @param {String} email - Email to validate
     * @returns {Boolean} Whether email is valid
     */
    _isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate phone number format
     * @private
     * @param {String} phone - Phone number to validate
     * @returns {Boolean} Whether phone number is valid
     */
    _isValidPhoneNumber(phone) {
        // Nigerian phone number validation
        const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    }
    
    /**
     * Validate date format
     * @private
     * @param {String|Date} date - Date to validate
     * @returns {Boolean} Whether date is valid
     */
    _isValidDate(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    }
    
    /**
     * Check minimum age requirement
     * @private
     * @param {String|Date} date - Date of birth
     * @returns {Boolean} Whether user meets minimum age
     */
    _isMinimumAge(date) {
        const birthDate = new Date(date);
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 16);
        return birthDate <= minAgeDate;
    }
    
    /**
     * Validate password strength
     * @private
     * @param {String} password - Password to validate
     * @returns {Boolean} Whether password is strong enough
     */
    _isStrongPassword(password) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
    
    /**
     * Transform DTO for registration service
     * @returns {Object} Registration data
     */
    toRegistration() {
        return {
            firstName: this._data.firstName,
            lastName: this._data.lastName,
            email: this._data.email.toLowerCase(),
            phoneNumber: this._data.phoneNumber,
            dateOfBirth: this._data.dateOfBirth,
            gender: this._data.gender,
            location: {
                state: this._data.location.state,
                city: this._data.location.city,
                address: this._data.location.address
            },
            password: this._data.password,
            userType: this._data.userType || 'Youth'
        };
    }
    
    /**
     * Get registration data
     * @returns {Object} Registration data
     */
    getRegistrationData() {
        return this.toRegistration();
    }
}

module.exports = RegisterDTO;