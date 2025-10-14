/**
 * User Data Transfer Object (DTO) - YouthGuard Platform
 * 
 * This DTO controls the data transfer for User entities between layers.
 * It ensures only necessary data is exposed and provides validation.
 * 
 * Key Features:
 * - User data validation
 * - Data transformation for API responses
 * - Security-sensitive field filtering
 */

const BaseDTO = require('./BaseDTO');

/**
 * UserDTO Class
 * 
 * DTO for User entity with validation and transformation methods.
 */
class UserDTO extends BaseDTO {
    /**
     * Constructor
     * @param {Object} data - User data
     */
    constructor(data = {}) {
        super(data);
        this._validateData();
    }
    
    /**
     * Validate user data
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
        } else if (!this._isValidEmail(this._data.email)) {
            errors.push('Invalid email format');
        }
        
        if (this._data.phoneNumber && !this._isValidPhoneNumber(this._data.phoneNumber)) {
            errors.push('Invalid phone number format');
        }
        
        if (this._data.dateOfBirth && !this._isValidDate(this._data.dateOfBirth)) {
            errors.push('Invalid date of birth');
        } else if (this._data.dateOfBirth && !this._isMinimumAge(this._data.dateOfBirth)) {
            errors.push('Must be at least 16 years old');
        }
        
        if (this._data.gender && !['male', 'female', 'other'].includes(this._data.gender)) {
            errors.push('Invalid gender value');
        }
        
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
     * Transform DTO for public API response
     * @returns {Object} Public user data
     */
    toPublicResponse() {
        return {
            id: this._data._id || this._data.id,
            firstName: this._data.firstName,
            lastName: this._data.lastName,
            email: this._data.email,
            phoneNumber: this._data.phoneNumber,
            dateOfBirth: this._data.dateOfBirth,
            gender: this._data.gender,
            location: this._data.location,
            profilePicture: this._data.profilePicture,
            bio: this._data.bio,
            userType: this._data.userType,
            isActive: this._data.isActive,
            isEmailVerified: this._data.isEmailVerified,
            isPhoneVerified: this._data.isPhoneVerified,
            accountStatus: this._data.accountStatus,
            lastLogin: this._data.lastLogin,
            createdAt: this._data.createdAt,
            updatedAt: this._data.updatedAt,
            fullName: this._data.firstName && this._data.lastName ? 
                `${this._data.firstName} ${this._data.lastName}` : undefined,
            age: this._data.dateOfBirth ? this._calculateAge(this._data.dateOfBirth) : undefined
        };
    }
    
    /**
     * Transform DTO for profile update
     * @returns {Object} Profile update data
     */
    toProfileUpdate() {
        return {
            firstName: this._data.firstName,
            lastName: this._data.lastName,
            phoneNumber: this._data.phoneNumber,
            dateOfBirth: this._data.dateOfBirth,
            gender: this._data.gender,
            location: this._data.location,
            profilePicture: this._data.profilePicture,
            bio: this._data.bio
        };
    }
    
    /**
     * Transform DTO for registration
     * @returns {Object} Registration data
     */
    toRegistration() {
        return {
            firstName: this._data.firstName,
            lastName: this._data.lastName,
            email: this._data.email,
            phoneNumber: this._data.phoneNumber,
            dateOfBirth: this._data.dateOfBirth,
            gender: this._data.gender,
            location: this._data.location,
            password: this._data.password,
            userType: this._data.userType || 'Youth'
        };
    }
    
    /**
     * Calculate age from date of birth
     * @private
     * @param {String|Date} dateOfBirth - Date of birth
     * @returns {Number} Age in years
     */
    _calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    /**
     * Create DTO from user model
     * @static
     * @param {Object} user - User model instance
     * @returns {UserDTO} User DTO instance
     */
    static fromModel(user) {
        return new UserDTO({
            _id: user._id,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            location: user.location,
            profilePicture: user.profilePicture,
            bio: user.bio,
            userType: user.userType,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            accountStatus: user.accountStatus,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
}

module.exports = UserDTO;